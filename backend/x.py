from azure.cosmos import CosmosClient

# Define the connection string
connection_string = "AccountEndpoint=https://workouts-db.documents.azure.com:443/;AccountKey=vSxUPf3A9nMETgCXYzAn0OOGwlMYg2uEOKzLbLte5VsTaoPVhzVhXQb8taMPpcLbhAixWDs86IAnACDb3jCE5g==;"

# Initialize the Cosmos DB client
client = CosmosClient.from_connection_string(connection_string)

# Specify the database and container
database_name = 'db'
container_name = 'workouts'

# Create a reference to the database and container
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)

# Define your query to retrieve all items
query = "SELECT * FROM c"

# Execute the query
query_result = container.query_items(query=query, enable_cross_partition_query=True)

# Print the results
for item in query_result:
    print(item)
