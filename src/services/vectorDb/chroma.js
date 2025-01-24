
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv"
import { Chroma } from "@langchain/community/vectorstores/chroma";
import axios from "axios";
dotenv.config()
// here we use chroma db as vector db


const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    openAIApiKey: process.env.OPENAI_API_KEY
});

export const client = new ChromaClient();


// create a chroma vector db collection

export const createCollection = async () => {
    try {
        const collection = await client.createCollection({
            name: process.env.CHROMA_COLLECTION_NAME,
            embeddingFunction: embeddings,
        });
        return collection

    } catch (error) {
        console.log("Error creating vector store", error);

    }
}

export const getCollection = async () => {
    try {
        return new Chroma(new OpenAIEmbeddings(), {
            collectionName: process.env.CHROMA_COLLECTION_NAME,
        });
    } catch (error) {
        throw error
    }
}


// add documents to vector db


export const addDocumentsTovectorDb = async (content) => {
    try {
        const collection = await getCollection()

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 2048,
            chunkOverlap: 1,
            separators: ["|", "##", ">", "-"],
        });

        const documents = await splitter.splitDocuments([
            new Document({ pageContent: content }),
        ]);

        const ids = await collection.addDocuments(documents);
        console.log(ids);
        return {
            ids: ids,
        };

    } catch (error) {
        console.error("Error adding documents to vector store:", error);
    }
};

// Add website data in to vector database

export const addWebsiteDataTovectorDb = async (link) => {
    try {

        const collection = await getCollection()
        const content = axios.get(link)
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 2048,
            chunkOverlap: 1,
            separators: ["|", "##", ">", "-"],
        });

        const documents = await splitter.splitDocuments([
            new Document({ pageContent: content }),
        ]);

        const result = await collection.addDocuments(documents);
        return result


    } catch (error) {
        console.error("Error adding documents to vector store:", error);
    }
};

// retrive decuments from vector store


export const retriveContents = async (text) => {
    try {
        const collection = await getCollection()

        const search = await collection.similaritySearch(text, 10);

        return search;
    } catch (error) {
        console.log(error);
        throw error
    }
};



// delete  collection



export const deleteCollection = async () => {
    try {

        return await client.deleteCollection(process.env.CHROMA_COLLECTION_NAME)

    } catch (error) {
        console.log(error);
        throw error
    }
};

//lsit collections


export const listCollections = async () => {
    try {
        return await client.listCollections()
    } catch (error) {
        throw error
    }
}





