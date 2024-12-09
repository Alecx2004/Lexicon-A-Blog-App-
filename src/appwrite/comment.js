/* eslint-disable no-useless-catch */
import conf from "../conf/conf.js";
import { Client, ID, Databases, Query } from "appwrite";

export class CommentService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async createComment({ postId, userId, content, author }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentCollectionId,
        ID.unique(),
        {
          postId,
          userId,
          content,
          author,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async getComments(postId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCommentCollectionId,
        [Query.equal("postId", postId)]
      );
    } catch (error) {
      throw error;
    }
  }

  async updateComment(commentId, { content }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentCollectionId,
        commentId,
        {
          content,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentCollectionId,
        commentId
      );
    } catch (error) {
      throw error;
    }
  }
}

const commentService = new CommentService();
export default commentService;
