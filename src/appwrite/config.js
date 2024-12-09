/* eslint-disable no-useless-catch */
import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
    author,
  }) {
    try {
      return this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
          author,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite serve :: deletePost:: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite serve :: getPost:: error", error);
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite serve :: getPosts:: error", error);
      return false;
    }
  }

  //   file upload services
  async uploadFile(file) {
    try {
      if (!file) {
        console.warn('No file provided for upload');
        return null;
      }
      
      const uploadedFile = await this.storage.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
      
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      if (!fileId) {
        console.warn('No file ID provided for deletion');
        return false;
      }
      
      await this.storage.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  getFilePreview(fileId) {
    try {
      if (!fileId) {
        console.warn('No file ID provided');
        return '';
      }
      
      const previewUrl = this.storage.getFilePreview(
        conf.appwriteBucketId,
        fileId,
        2000, // width
        2000, // height
        'center',
        100, // quality
        1, // border
        '', // background color
        'jpg' // output format
      );

      // Ensure the URL is correctly constructed
      return previewUrl;
    } catch (error) {
      console.error('Error generating file preview URL:', error);
      return '';
    }
  }
}

const service = new Service();
export default service;
