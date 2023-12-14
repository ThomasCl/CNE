#!/bin/bash

# Set your Azure Storage account name, container name, and SAS token
storage_account="$AZURE_STORAGE_ACCOUNT"
container_name="$AZURE_STORAGE_CONTAINER"
sas_token="$AZURE_STORAGE_SAS_TOKEN"

# Set the local folder path
local_folder="frontendHTML"

# List all blobs in the container and save them to a temporary file
az storage blob list --account-name $storage_account --container-name $container_name --sas-token "$sas_token" --query "[].name" -o tsv > azure_blobs.txt

# Iterate over each file in the local folder and its subfolders
find "$local_folder" -type f | while read -r file_path; do
    if [ -f "$file_path" ]; then
        # Extract the relative path from the local folder
        relative_path=${file_path#$local_folder/}

        # Remove the file from the list of Azure blobs (to prevent deletion later)
        sed -i "/$relative_path/d" azure_blobs.txt

        # Construct the Blob Storage URL for the file
        blob_url="https://$storage_account.blob.core.windows.net/$container_name/$relative_path?$sas_token"

        # Set Content-Type based on file extension
        extension="${file_path##*.}"
        content_type=""
        if [ "$extension" == "css" ]; then
            content_type="text/css"
        else
            content_type=$(file --mime-type -b "$file_path")
        fi

        # Upload the file to Blob Storage using curl
        curl -X PUT -T "$file_path" -H "x-ms-blob-type: BlockBlob" -H "Content-Type: $content_type" "$blob_url"
    fi
done

# Delete blobs that are not present in the local directory
while read -r blob; do
    echo "Deleting $blob from Azure Storage..."
    az storage blob delete --account-name $storage_account --container-name $container_name --name "$blob" --sas-token "$sas_token"
done < azure_blobs.txt

# Clean up the temporary file
rm azure_blobs.txt
