import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, json
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='/static')


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/data.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

@app.route("/")
def index():
    return render_template("index.html")

# Save references to each table
Bike_data = Base.classes.data

@app.route("/coords")
def coords():

    stmt = db.session.query(Bike_data).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    coords = []
    counter = 0

    for row in range(165):
        
        coords.append([
            list(df.geo_point_2d)[counter][9:18], 
            list(df.geo_point_2d)[counter][27:-2], 
            list(df.bike_injur)[counter],
            list(df.rd_conditi)[counter],
            list(df.light_cond)[counter],
            list(df.weather)[counter],
            list(df.crashday)[counter],
            list(df.hit_run)[counter],
        ])
        
        counter += 1

    return jsonify(coords)

@app.route("/traffic")
def traffic():
    filename = os.path.join("db", 'traffic_signals.geojson')
    with open(filename) as traffic_data:
        data = json.load(traffic_data)

        return jsonify(data)

from PIL import Image

@app.route('/images')
def root():
   return app.send_static_file('BicycleMarkerSymbol.png')

@app.route('/images2')
def images2():
   return app.send_static_file('picture1.png')

if __name__ == "__main__":
    app.run(debug=True)
