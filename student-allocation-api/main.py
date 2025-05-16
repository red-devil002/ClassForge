# import os
# from flask import Flask, jsonify
# from flask import request
# from flask_cors import CORS
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy import Column, Integer, String, Float
# from dotenv import load_dotenv

# import pandas as pd
# import numpy as np
# import torch
# from torch_geometric.data import Data
# from torch_geometric.nn import GCNConv
# from sklearn.cluster import KMeans
# from sklearn.preprocessing import LabelEncoder, StandardScaler

# # Load environment variables
# load_dotenv()

# # Database setup
# DATABASE_URL = os.getenv("DATABASE_URL")

# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(bind=engine)
# Base = declarative_base()

# # SQLAlchemy models
# class Student(Base):
#     __tablename__ = "students"
#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#     academic = Column(Float)
#     wellbeing = Column(Float)
#     activities = Column(String)
#     friends = Column(String)
#     disrespectful = Column(String)
#     studentClass = Column(Integer)

# class Priority(Base):
#     __tablename__ = "priorities"
#     id = Column(Integer, primary_key=True)
#     academic_weight = Column(Float)
#     wellbeing_weight = Column(Float)
#     activities_weight = Column(Float)
#     friends_weight = Column(Float)
#     disrespect_weight = Column(Float)

# # GCN model definition
# class GCN(torch.nn.Module):
#     def __init__(self, in_channels, hidden_channels, out_channels):
#         super().__init__()
#         self.conv1 = GCNConv(in_channels, hidden_channels)
#         self.conv2 = GCNConv(hidden_channels, out_channels)

#     def forward(self, x, edge_index):
#         x = self.conv1(x, edge_index)
#         x = torch.relu(x)
#         x = self.conv2(x, edge_index)
#         return x

# # Core allocation logic
# def run_allocation(session):
#     students = session.query(Student).all()
#     priorities = session.query(Priority).order_by(Priority.id.desc()).first()

#     if not students or not priorities:
#         return {"error": "Insufficient data or missing priorities."}

#     # Convert DB records to DataFrame
#     df = pd.DataFrame([{
#         "student_id": s.id,
#         "name": s.name,
#         "academic": s.academic,
#         "wellbeing": s.wellbeing,
#         "activity": s.activities or "none"
#     } for s in students])

#     # Encode categorical and normalize numerical data
#     le = LabelEncoder()
#     df["activity"] = le.fit_transform(df["activity"])
#     scaler = StandardScaler()
#     df[["academic", "wellbeing"]] = scaler.fit_transform(df[["academic", "wellbeing"]])

#     # Apply weights from priorities
#     df["academic"] *= priorities.academic_weight
#     df["wellbeing"] *= priorities.wellbeing_weight
#     df["activity"] *= priorities.activities_weight

#     # Convert features to tensor
#     x = torch.tensor(df[["academic", "wellbeing", "activity"]].values, dtype=torch.float)

#     # Build social relationship edges
#     student_id_to_index = {s.id: i for i, s in enumerate(students)}
#     edges = []

#     for s in students:
#         src_idx = student_id_to_index[s.id]

#         # Friend edges
#         if s.friends:
#             for name in s.friends.split(","):
#                 name = name.strip()
#                 friend = next((f for f in students if f.name == name), None)
#                 if friend and friend.id in student_id_to_index:
#                     tgt_idx = student_id_to_index[friend.id]
#                     edges.append((src_idx, tgt_idx, priorities.friends_weight))

#         # Disrespect edges
#         if s.disrespectful:
#             for name in s.disrespectful.split(","):
#                 name = name.strip()
#                 enemy = next((f for f in students if f.name == name), None)
#                 if enemy and enemy.id in student_id_to_index:
#                     tgt_idx = student_id_to_index[enemy.id]
#                     edges.append((src_idx, tgt_idx, -priorities.disrespect_weight))

#     # Create edge_index tensor
#     if edges:
#         edge_index_np = np.array([(e[0], e[1]) for e in edges]).T
#         edge_index = torch.tensor(edge_index_np, dtype=torch.long)
#     else:
#         edge_index = torch.empty((2, 0), dtype=torch.long)

#     data = Data(x=x, edge_index=edge_index)

#     # Train GCN model
#     model = GCN(in_channels=3, hidden_channels=32, out_channels=16)
#     optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

#     model.train()
#     for _ in range(200):
#         optimizer.zero_grad()
#         out = model(data.x, data.edge_index)

#         loss_terms = []
#         for src, tgt, weight in edges:
#             if weight == 0:
#                 continue
#             diff = out[src] - out[tgt]
#             term = weight * torch.norm(diff, p=2)
#             loss_terms.append(term)

#         loss = torch.stack(loss_terms).mean() if loss_terms else torch.tensor(0.0, requires_grad=True)
#         loss.backward()
#         optimizer.step()

#     # Get node embeddings
#     model.eval()
#     with torch.no_grad():
#         embeddings = model(data.x, data.edge_index).numpy()

#     # Cluster into groups (max 3)
#     num_clusters = min(3, len(df))
#     kmeans = KMeans(n_clusters=num_clusters, random_state=42)
#     clusters = kmeans.fit_predict(embeddings)
#     df["assigned_class"] = clusters + 1  # Make 1-based classes

#     # Return the result (no DB update)
#     result = {
#         "message": "✅ Allocation complete",
#         "classes": df["assigned_class"].nunique(),
#         "assigned": df[["student_id", "name", "academic", "wellbeing", "activity", "assigned_class"]].to_dict(orient="records")
#     }
#     return result

# # Flask app setup
# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# @app.route("/run-allocation", methods=["POST"])
# def allocate():
#     session = SessionLocal()
#     try:
#         data = request.get_json()

#         if not data:
#             return jsonify({"error": "Missing priority data"}), 400

#         # Simulate a priority object using dynamic attributes
#         class PriorityInput:
#             academic_weight = data.get("academic", 1.0)
#             wellbeing_weight = data.get("wellbeing", 1.0)
#             friends_weight = data.get("friends", 1.0)
#             disrespect_weight = data.get("disrespect", 1.0)
#             activities_weight = data.get("activities", 1.0)

#         result = run_allocation(session, PriorityInput())
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#     finally:
#         session.close()

# # Required for gunicorn (Render deployment)
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 4000)), debug=False)


import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Column, String, Float, DateTime, Integer
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from datetime import datetime

import pandas as pd
import numpy as np
import torch
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Load .env file (for DATABASE_URL)
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# ✅ Matches your actual Prisma schema (Student table)
class Student(Base):
    __tablename__ = "Student"

    id = Column(String, primary_key=True)  # CUID from Prisma
    userId = Column(String, unique=True)
    name = Column(String)
    gender = Column(String)
    age = Column(Integer)
    academicScore = Column(Float)
    grades = Column(String)
    wellBeingScore = Column(Float)
    socioEconomicsStatus = Column(String)
    activities = Column(String)  # We will parse this from CSV-like string
    teacherId = Column(String)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

# You no longer need Priority table — using weights from frontend now

# GCN model definition
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

# Main allocation function — now accepts dynamic priority weights
def run_allocation(session, priorities):
    students = session.query(Student).all()

    if not students:
        return {"error": "No student data found."}

    # Prepare the DataFrame
    df = pd.DataFrame([{
        "student_id": s.id,
        "name": s.name,
        "academic": s.academicScore,
        "wellbeing": s.wellBeingScore,
        "activity": ",".join(s.activities) if isinstance(s.activities, list) else s.activities or "none",
        "friends": "",  # Not used in Prisma schema (yet)
        "disrespectful": ""  # Not used in Prisma schema (yet)
    } for s in students])

    # Label encode activities (categorical)
    le = LabelEncoder()
    df["activity"] = le.fit_transform(df["activity"])

    # Normalize academic + wellbeing
    scaler = StandardScaler()
    df[["academic", "wellbeing"]] = scaler.fit_transform(df[["academic", "wellbeing"]])

    # Apply frontend weights
    df["academic"] *= priorities["academic"]
    df["wellbeing"] *= priorities["wellbeing"]
    df["activity"] *= priorities["activities"]

    # Build input features
    x = torch.tensor(df[["academic", "wellbeing", "activity"]].values, dtype=torch.float)

    # No social relationships in schema → create empty edge_index
    edge_index = torch.empty((2, 0), dtype=torch.long)

    # Build PyG Data object
    data = Data(x=x, edge_index=edge_index)

    # GCN model setup
    model = GCN(in_channels=3, hidden_channels=32, out_channels=16)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

    # Training
    model.train()
    for _ in range(200):
        optimizer.zero_grad()
        out = model(data.x, data.edge_index)
        loss = torch.tensor(0.0, requires_grad=True)
        loss.backward()
        optimizer.step()

    # Embedding inference
    model.eval()
    with torch.no_grad():
        embeddings = model(data.x, data.edge_index).numpy()

    # Clustering students
    num_clusters = min(3, len(df))
    kmeans = KMeans(n_clusters=num_clusters, random_state=42)
    clusters = kmeans.fit_predict(embeddings)
    df["assigned_class"] = clusters + 1  # Make 1-based classes

    # Final output
    return {
        "message": "✅ Allocation complete",
        "classes": num_clusters,
        "assigned": df[["student_id", "name", "academic", "wellbeing", "activity", "assigned_class"]].to_dict(orient="records")
    }

# Flask App
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

@app.route("/run-allocation", methods=["POST"])
def allocate():
    session = SessionLocal()
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Missing priority weights"}), 400

        # Priorities passed from frontend
        priorities = {
            "academic": data.get("academic", 1.0),
            "wellbeing": data.get("wellbeing", 1.0),
            "friends": data.get("friends", 1.0),  # unused
            "disrespect": data.get("disrespect", 1.0),  # unused
            "activities": data.get("activities", 1.0)
        }

        result = run_allocation(session, priorities)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# For local or gunicorn use
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 4000)), debug=False)
