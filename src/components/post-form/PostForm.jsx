/* eslint-disable react/prop-types */
import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createPost } from "../../store/postSlice";

export default function PostForm({
  title,
  content,
  status,
  featuredImage,
  $id,
}) {
  const [url, setUrl] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const { loading, error } = useSelector((state) => state.post);

  useEffect(() => {
    if (slug && featuredImage) {
      const response = appwriteService.getFilePreview(featuredImage);
      if (response) {
        setUrl(response);
      }
    }
  }, [slug, featuredImage]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: title || "",
      slug: slug || "",
      content: content || "",
      status: status || "active",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const submit = async (data) => {
    try {
      if (featuredImage) {
        let fileId = featuredImage;
        if (data.image[0]) {
          const file = await appwriteService.uploadFile(data.image[0]);
          if (file) {
            await appwriteService.deleteFile(featuredImage);
            fileId = file.$id;
          }
        }

        const dbPost = await appwriteService.updatePost($id, {
          ...data,
          featuredImage: fileId,
        });
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          const fileId = file.$id;
          const result = await dispatch(
            createPost({
              ...data,
              featuredImage: fileId,
              userId: userData.$id,
              author: userData.name,
            })
          ).unwrap();

          if (result?.$id) {
            navigate(`/post/${result.$id}`);
          } else {
            throw new Error("Post created but no ID returned");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      // You might want to set an error state here to display to the user
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-200">Submitting post...</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(submit)} className="flex flex-wrap mx-auto max-w-7xl">
        <div className="w-full lg:w-2/3 px-2 mb-4 lg:mb-0">
          <Input
            label="Title :"
            placeholder="Title"
            className="mb-4 dark:bg-gray-800 dark:text-white"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mb-4">Title is required</p>
          )}
          <Input
            label="Slug :"
            placeholder="Slug"
            className="mb-4 dark:bg-gray-800 dark:text-white"
            {...register("slug", { required: true })}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mb-4">Slug is required</p>
          )}
          <div className="mb-4">
            <label className="inline-block mb-1 pl-1" htmlFor="content">
              Content:
            </label>
            <textarea
              id="content"
              {...register("content", { required: true })}
              defaultValue={content}
              className="min-h-[300px] w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white resize-y"
              placeholder="Write your blog content here..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">Content is required</p>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/3 px-2">
          <div className="mb-4">
            <Input
              label="Featured Image :"
              type="file"
              className="mb-4 dark:bg-gray-800 dark:text-white"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              {...register("image", { required: !featuredImage })}
              onChange={(e) => {
                const imageField = register("image");
                imageField.onChange(e);
                handleImageChange(e);
              }}
            />
            {(previewImage || featuredImage) && (
              <div className="w-full mb-4">
                <img
                  src={previewImage || url}
                  alt={title || "Preview"}
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>
            )}
            {errors.image && (
              <p className="text-red-500 text-sm mb-4">Featured image is required</p>
            )}
          </div>
          <Select
            options={["active", "inactive"]}
            label="Status"
            className="mb-4 dark:bg-gray-800 dark:text-white"
            {...register("status", { required: true })}
          />
          <Button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''} dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white`}
          >
            {loading ? "Submitting..." : $id ? "Update" : "Submit"}
          </Button>
          {error && <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>}
        </div>
      </form>
    </>
  );
}
