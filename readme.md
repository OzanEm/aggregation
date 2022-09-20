# API overview

The API is comprised of a Nestjs back-end, a postgresql database and a reddis cache. The API works under the assumption that there won't be more than 2\*\*31 unique users from the data streams. The API will store the data at postgresql and it will use reddis cache to respond to incoming requests.

# URLS

API will listen http://localhost:3000 POST request for incoming data streams and it respond to get requests from http://localhost:3000/tickers GET for total amount of tickers, http://localhost:3000/tickers/:id for tickers per user where "id" is a userId.

# Data streams

The API consumes a JSON payload of `{ “ticker”: string, “userId”: string, “Balance”: string (big number)}`. From these data streams API will aggragete total "tickers" and total "ticker" per user. The return type of the API is JSON that is comprimised of `{ "ticker" # e.g ETH : "balance" # e.g. 500 }`

# How to run

In order to run the API you should have docker installed at your computer, and you should create a .env file for the API to use. A sample of this can be seen at sample.env , for ease of use you could just change the file name to .env and it will work. Simply "run docker-compose up agg" in order to use the API.
