import { Router } from "express";
import * as vectorDbController from "../controller/vectorDbController.js"
const router = Router()

router.post('/create-collection', vectorDbController.createCollectionController);
router.post('/add-documents', vectorDbController.addDocumentsController);
router.post('/add-website-data', vectorDbController.addWebsiteDataController);
router.get('/retrieve-contents', vectorDbController.retrieveContentsController);
router.delete('/delete-collection', vectorDbController.deleteCollectionController);
router.get('/list-collections', vectorDbController.listCollectionsController);


export default router