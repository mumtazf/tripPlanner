import pool from './database.js'

import './dotenv.js'
import { fileURLToPath } from 'url'
import {dirname} from 'path'
import fs from 'fs'
import path from 'path'
import { create } from 'domain'

//why do we do this?

const currentPath = fileURLToPath(import.meta.url)
const tripsFile = fs.readFileSync(path.join(dirname(currentPath),'./data/data.json'))

const tripsData = JSON.parse(tripsFile)

//creating tables
const createTripsTable = async() => {

    const createTripsTableQuery = `
    CREATE TABLE IF NOT EXISTS trips (
        id serial PRIMARY KEY,
        title varchar(100) NOT NULL,
        description varchar(500) NOT NULL,
        img_url text NOT NULL,
        num_days integer NOT NULL,
        start_date date NOT NULL,
        end_date date NOT NULL,
        total_cost money NOT NULL
    )`

    try{
        const res = await pool.query(createTripsTableQuery)
        console.log('Trips table created successfully')
    } catch(error){
        console.log("⚠️ error creating trips table", error)
    }
}

const seedTripsTable = async() => {
    await createTripsTable()


    tripsData.forEach((trip) => {
        //first you create an insert query
        const insertTripQuery = {
            text: 'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        }
        //then you have values that constains the attributes for the trip variable
        const values = [
            trip.title,
            trip.description,
            trip.img_url,
            trip.num_days,
            trip.start_date,
            trip.end_date,
            trip.total_cost
        ]
        //now query the table with insert query and if there is an error then display it
        pool.query(insertTripQuery, values, (error, results) => {
            if(error){
                console.log("⚠️ error seeding trips table", error);
                return;
            }
            console.log(`Inserted ${trip.title} into trips table successfully`)
        })
    })
}

const createDestinationsTable = async() => {
    const createDestinationsTableQuery = `
    CREATE TABLE IF NOT EXISTS destinations(
        id serial PRIMARY KEY,
        destination varchar(100) NOT NULL,
        description varchar(500) NOT NULL,
        city varchar(100) NOT NULL,
        country varchar(100) NOT NULL,
        img_url text NOT NULL,
        flag_img_url text NOT NULL
    )`

    try{
        const res = await pool.query(createDestinationsTableQuery)
        console.log('Destinations table created successfully');
    } catch(error){
        console.log('⚠️ error creating destinations table', error);
    }
}

const createActivitiesTable = async () => {
    const createActivitiesTableQuery = `
        CREATE TABLE IF NOT EXISTS activities (
            id serial PRIMARY KEY,
            trip_id int NOT NULL,
            activity varchar(100) NOT NULL,
            num_votes integer DEFAULT 0,
            FOREIGN KEY(trip_id) REFERENCES trips(id)
        );
    `
    try{
        const res = await pool.query(createActivitiesTableQuery)
        console.log('Destinations table created successfully');
    } catch(error){
        console.log('⚠️ error creating activities table', error);
    }
}

const createTripsDestinationsTable = async () => {
    const createTripsDestinationsTableQuery = `
        CREATE TABLE IF NOT EXISTS trips_destinations (
            trip_id int NOT NULL,
            destination_id int NOT NULL,
            PRIMARY KEY (trip_id, destination_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
        );
    `
    try {
        const res = await pool.query(createTripsDestinationsTableQuery)
        console.log('🎉 trips_destinations table created successfully')
      } catch (err) {
        console.error('⚠️ error creating trips_destinations table', err)
      }
  }

  const createUsersTable = async () => {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users(
            id serial PRIMARY KEY,
            githubid integer NOT NULL,
            username varchar(100) NOT NULL,
            avatarurl varchar(500) NOT NULL,
            accesstoken varchar(500) NOT NULL
        )`
        
  }



seedTripsTable()
createDestinationsTable()
createActivitiesTable()