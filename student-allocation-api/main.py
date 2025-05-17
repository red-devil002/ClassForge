# import os
# import logging
# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from sqlalchemy import create_engine, Column, String, Float, DateTime, Integer
# from sqlalchemy.orm import sessionmaker, declarative_base
# from dotenv import load_dotenv
# from datetime import datetime

# import pandas as pd
# import numpy as np
# import torch
# from torch_geometric.data import Data
# from torch_geometric.nn import GCNConv
# from sklearn.cluster import KMeans
# from sklearn.preprocessing import LabelEncoder, StandardScaler

# # --------------------------
# # Setup & Configuration
# # --------------------------

# load_dotenv()
# DATABASE_URL = os.getenv("DATABASE_URL")

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(bind=engine)
# Base = declarative_base()

# # --------------------------
# # SQLAlchemy ORM Model
# # --------------------------

# class Student(Base):
#     __tablename__ = "Student"

#     id = Column(String, primary_key=True)
#     userId = Column(String, unique=True)
#     name = Column(String)
#     gender = Column(String)
#     age = Column(Integer)
#     academicScore = Column(Float)
#     grades = Column(String)
#     wellBeingScore = Column(Float)
#     socioEconomicsStatus = Column(String)
#     activities = Column(String)  # stored as CSV string
#     teacherId = Column(String)
#     createdAt = Column(DateTime)
#     updatedAt = Column(DateTime)

# # --------------------------
# # GCN Model
# # --------------------------

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

# # --------------------------
# # Allocation Logic
# # --------------------------

# def safe_float(value, default=1.0):
#     try:
#         return float(value)
#     except:
#         return default

# def run_allocation(session, priorities, cluster_count=None):
#     students = session.query(Student).all()

#     if not students:
#         return {"error": "No student data found."}

#     # Prepare DataFrame
#     df = pd.DataFrame([{
#         "student_id": s.id,
#         "name": s.name,
#         "academic": s.academicScore or 0.0,
#         "wellbeing": s.wellBeingScore or 0.0,
#         "activity": s.activities if s.activities else "none"
#     } for s in students])

#     # Encode categorical activities
#     le = LabelEncoder()
#     df["activity"] = le.fit_transform(df["activity"])

#     # Normalize features
#     scaler = StandardScaler()
#     df[["academic", "wellbeing"]] = scaler.fit_transform(df[["academic", "wellbeing"]])

#     # Apply frontend priorities
#     df["academic"] *= priorities["academic"]
#     df["wellbeing"] *= priorities["wellbeing"]
#     df["activity"] *= priorities["activities"]

#     # Feature tensor
#     x = torch.tensor(df[["academic", "wellbeing", "activity"]].values, dtype=torch.float)

#     # No edges (social graph not implemented yet)
#     edge_index = torch.empty((2, 0), dtype=torch.long)

#     data = Data(x=x, edge_index=edge_index)

#     # GCN embedding
#     model = GCN(in_channels=3, hidden_channels=32, out_channels=16)
#     model.eval()
#     with torch.no_grad():
#         embeddings = model(data.x, data.edge_index).numpy()

#     # Clustering
#     num_clusters = min(cluster_count or 3, len(df))  # Use passed or default
#     kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init='auto')
#     clusters = kmeans.fit_predict(embeddings)
#     df["assigned_class"] = clusters + 1  # 1-based class labels

#     df.rename(columns={
#         "academic": "academicScore",
#         "wellbeing": "wellBeingScore"
#     }, inplace=True)

#     return {
#         "message": "✅ Allocation complete",
#         "classes": num_clusters,
#         "assigned": df[[
#             "student_id", "name", "academicScore", "wellBeingScore", "activity", "assigned_class"
#         ]].to_dict(orient="records")
#     }

# # --------------------------
# # Flask App Setup
# # --------------------------

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})

# @app.route("/run-allocation", methods=["POST"])
# def allocate():
#     session = SessionLocal()
#     try:
#         data = request.get_json()

#         if not data:
#             return jsonify({"error": "Missing priority weights"}), 400

#         priorities = {
#             "academic": safe_float(data.get("academic", 1.0)),
#             "wellbeing": safe_float(data.get("wellbeing", 1.0)),
#             "activities": safe_float(data.get("activities", 1.0)),
#         }

#         cluster_count = data.get("clusters")  # Optional cluster count
#         if cluster_count:
#             cluster_count = int(cluster_count)

#         logger.info(f"Running allocation with weights: {priorities} and clusters: {cluster_count}")
#         result = run_allocation(session, priorities, cluster_count)
#         return jsonify(result)
#     except Exception as e:
#         logger.exception("Allocation error")
#         return jsonify({"error": str(e)}), 500
#     finally:
#         session.close()

# # --------------------------
# # Run Server (Dev/Prod)
# # --------------------------

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 4000)), debug=False)


import os
import logging
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

# --------------------------
# Setup & Configuration
# --------------------------

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# --------------------------
# SQLAlchemy ORM Model
# --------------------------

class Student(Base):
    __tablename__ = "Student"

    id = Column(String, primary_key=True)
    userId = Column(String, unique=True)
    name = Column(String)
    gender = Column(String)
    age = Column(Integer)
    academicScore = Column(Float)
    grades = Column(String)
    wellBeingScore = Column(Float)
    socioEconomicsStatus = Column(String)
    activities = Column(String)
    teacherId = Column(String)
    friends = Column(String)
    disrespectfull = Column(String)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

# --------------------------
# GCN Model
# --------------------------

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

# --------------------------
# Allocation Logic
# --------------------------

def safe_float(value, default=1.0):
    try:
        return float(value)
    except:
        return default

def run_allocation(session, priorities, cluster_count=None):
    students = session.query(Student).all()

    if not students:
        return {"error": "No student data found."}

    # Prepare DataFrame with expanded fields
    df = pd.DataFrame([{
        "student_id": s.id,
        "name": s.name,
        "academic": s.academicScore or 0.0,
        "wellbeing": s.wellBeingScore or 0.0,
        "activity": s.activities if s.activities else "none",
        "gender": s.gender,
        "age": s.age,
        "grades": s.grades,
        "socioEconomicsStatus": s.socioEconomicsStatus,
        "teacherId": s.teacherId,
        "friends": s.friends,
        "disrespectfull": s.disrespectfull
    } for s in students])

    # Encode categorical activities
    le = LabelEncoder()
    df["activity"] = le.fit_transform(df["activity"])

    # Normalize features
    scaler = StandardScaler()
    df[["academic", "wellbeing"]] = scaler.fit_transform(df[["academic", "wellbeing"]])

    # Apply frontend priorities
    df["academic"] *= priorities["academic"]
    df["wellbeing"] *= priorities["wellbeing"]
    df["activity"] *= priorities["activities"]

    # Feature tensor
    x = torch.tensor(df[["academic", "wellbeing", "activity"]].values, dtype=torch.float)

    # No edges (social graph not implemented yet)
    edge_index = torch.empty((2, 0), dtype=torch.long)

    data = Data(x=x, edge_index=edge_index)

    # GCN embedding
    model = GCN(in_channels=3, hidden_channels=32, out_channels=16)
    model.eval()
    with torch.no_grad():
        embeddings = model(data.x, data.edge_index).numpy()

    # Clustering
    num_clusters = min(cluster_count or 3, len(df))  # Use passed or default
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init='auto')
    clusters = kmeans.fit_predict(embeddings)
    df["assigned_class"] = clusters + 1  # 1-based class labels

    # Rename for consistency
    df.rename(columns={
        "academic": "academicScore",
        "wellbeing": "wellBeingScore",
        "activity": "activities"
    }, inplace=True)

    return {
        "message": "✅ Allocation complete",
        "classes": num_clusters,
        "assigned": df[[
            "student_id", "name", "academicScore", "wellBeingScore", "activities",
            "assigned_class", "gender", "age", "grades", "socioEconomicsStatus",
            "teacherId", "friends", "disrespectfull"
        ]].to_dict(orient="records")
    }

# --------------------------
# Flask App Setup
# --------------------------

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/run-allocation", methods=["POST"])
def allocate():
    session = SessionLocal()
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Missing priority weights"}), 400

        priorities = {
            "academic": safe_float(data.get("academic", 1.0)),
            "wellbeing": safe_float(data.get("wellbeing", 1.0)),
            "activities": safe_float(data.get("activities", 1.0)),
        }

        cluster_count = data.get("clusters")  # Optional cluster count
        if cluster_count:
            cluster_count = int(cluster_count)

        logger.info(f"Running allocation with weights: {priorities} and clusters: {cluster_count}")
        result = run_allocation(session, priorities, cluster_count)
        return jsonify(result)
    except Exception as e:
        logger.exception("Allocation error")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# --------------------------
# Run Server (Dev/Prod)
# --------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 4000)), debug=False)
