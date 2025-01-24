import * as vectorDbService from "../services/vectorDb/chroma.js"; // Adjust the path to your file accordingly

// Create a new collection
export const createCollectionController = async (req, res) => {
    try {
        const collection = await vectorDbService.createCollection();
        res.status(201).json({ message: "Collection created successfully", collection });
    } catch (error) {
        res.status(500).json({ error: "Failed to create collection", details: error.message });
    }
};

// Add documents to the vector database
export const addDocumentsController = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }
        const result = await vectorDbService.addDocumentsTovectorDb(content);
        res.status(200).json({ message: "Documents added successfully", result });
    } catch (error) {
        res.status(500).json({ error: "Failed to add documents", details: error.message });
    }
};

// Add website data to the vector database
export const addWebsiteDataController = async (req, res) => {
    try {
        const { link } = req.body;
        if (!link) {
            return res.status(400).json({ error: "Link is required" });
        }
        const result = await vectorDbService.addWebsiteDataTovectorDb(link);
        res.status(200).json({ message: "Website data added successfully", result });
    } catch (error) {
        res.status(500).json({ error: "Failed to add website data", details: error.message });
    }
};

// Retrieve documents from the vector store
export const retrieveContentsController = async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) {
            return res.status(400).json({ error: "Search text is required" });
        }
        const results = await vectorDbService.retriveContents(text);
        res.status(200).json({ message: "Documents retrieved successfully", results });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve documents", details: error.message });
    }
};

// Delete a collection
export const deleteCollectionController = async (req, res) => {
    try {
        await vectorDbService.deleteCollection();
        res.status(200).json({ message: "Collection deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete collection", details: error.message });
    }
};

// List all collections
export const listCollectionsController = async (req, res) => {
    try {
        const collections = await vectorDbService.listCollections();
        res.status(200).json({ message: "Collections retrieved successfully", collections });
    } catch (error) {
        res.status(500).json({ error: "Failed to list collections", details: error.message });
    }
};
