import pandas as pd
import numpy as np
import torch
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sqlalchemy.orm import Session
from db.models import Student, Priority

def run_allocation(session: Session):
    students = session.query(Student).all()
    priorities = session.query(Priority).order_by(Priority.id.desc()).first()

    if not students or not priorities:
        return {"error": "Insufficient data or missing priorities."}

    df = pd.DataFrame([{
        "student_id": s.id,
        "name": s.name,
        "academic": s.academic,
        "wellbeing": s.wellbeing,
        "activity": s.activities or "none"
    } for s in students])

    le = LabelEncoder()
    df["activity"] = le.fit_transform(df["activity"])
    scaler = StandardScaler()
    df[["academic", "wellbeing"]] = scaler.fit_transform(df[["academic", "wellbeing"]])

    df["academic"] *= priorities.academic_weight
    df["wellbeing"] *= priorities.wellbeing_weight
    df["activity"] *= priorities.activities_weight

    x = torch.tensor(df[["academic", "wellbeing", "activity"]].values, dtype=torch.float)

    print("🧠 Input features after weighting:\n", x[:5])

    student_id_to_index = {s.id: i for i, s in enumerate(students)}
    edges = []

    for s in students:
        src_idx = student_id_to_index[s.id]

        if s.friends:
            for name in s.friends.split(","):
                name = name.strip()
                friend = next((f for f in students if f.name == name), None)
                if friend and friend.id in student_id_to_index:
                    tgt_idx = student_id_to_index[friend.id]
                    edges.append((src_idx, tgt_idx, priorities.friends_weight))

        if s.disrespectful:
            for name in s.disrespectful.split(","):
                name = name.strip()
                enemy = next((f for f in students if f.name == name), None)
                if enemy and enemy.id in student_id_to_index:
                    tgt_idx = student_id_to_index[enemy.id]
                    edges.append((src_idx, tgt_idx, -priorities.disrespect_weight))

    print("🔗 Total edges formed:", len(edges))

    if edges:
        edge_index_np = np.array([(e[0], e[1]) for e in edges]).T
        edge_index = torch.tensor(edge_index_np, dtype=torch.long)
    else:
        edge_index = torch.empty((2, 0), dtype=torch.long)

    data = Data(x=x, edge_index=edge_index)

    class GCN(torch.nn.Module):
        def __init__(self, in_channels, hidden_channels, out_channels):
            super().__init__()
            self.conv1 = GCNConv(in_channels, hidden_channels)
            self.conv2 = GCNConv(hidden_channels, out_channels)

        def forward(self, x, edge_index):            
            x = self.conv1(x, edge_index)
            x = torch.relu(x)
            x = self.conv2(x, edge_index)
            return x

    model = GCN(in_channels=3, hidden_channels=32, out_channels=16)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

    model.train()
    for _ in range(200):
        optimizer.zero_grad()
        out = model(data.x, data.edge_index)

        loss_terms = []
        for src, tgt, weight in edges:
            if weight == 0:
                continue
            diff = out[src] - out[tgt]
            term = weight * torch.norm(diff, p=2)
            loss_terms.append(term)

        if loss_terms:
            loss = torch.stack(loss_terms).mean()
        else:
            loss = torch.tensor(0.0, requires_grad=True)

        loss.backward()
        optimizer.step()

    model.eval()
    with torch.no_grad():
        embeddings = model(data.x, data.edge_index).numpy()

    num_clusters = min(3, len(df))
    print(f"📦 Clustering into {num_clusters} groups")

    kmeans = KMeans(n_clusters=num_clusters, random_state=42)
    clusters = kmeans.fit_predict(embeddings)
    df["assigned_class"] = clusters + 1

    print("📊 Assigned classes:")
    print(df[["student_id", "name", "assigned_class"]])

    print("🔁 Updating database with new class assignments...")
    for _, row in df.iterrows():
        student = session.query(Student).filter(Student.id == row["student_id"]).first()
        if student:
            student.studentClass = int(row["assigned_class"])
    session.commit()

    return {"message": "✅ Allocation complete", "classes": df["assigned_class"].nunique()}
