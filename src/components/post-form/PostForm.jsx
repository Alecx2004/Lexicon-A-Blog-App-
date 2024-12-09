/* eslint-disable react/prop-types */
import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
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

  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
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
    if (featuredImage) {
      const file = data.image[0]
        ? appwriteService.uploadFile(data.image[0])
        : null;

      if (file) {
        appwriteService.deleteFile(featuredImage);
      }

      const dbPost = await appwriteService.updatePost($id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        try {
          const result = await dispatch(
            createPost({
              ...data,
              userId: userData.$id,
              author: userData.name,
            })
          ).unwrap();

          if (result?.$id) {
            navigate(`/post/${result.$id}`);
          } else {
            console.error("Post created but no ID returned");
          }
        } catch (error) {
          console.error("Error creating post:", error);
        }
      }
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
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4 dark:bg-gray-800 dark:text-white"
          {...register("title", { required: true })}
        />
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
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          className="dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="w-1/3 px-2">
        <div className="mb-4">
          <Input
            label="Featured Image :"
            type="file"
            className="mb-4 dark:bg-gray-800 dark:text-white"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", { required: !featuredImage })}
            onChange={(e) => {
              handleImageChange(e);
              register("image").onChange(e);
            }}
          />
          {(previewImage || featuredImage) && (
            <div className="w-full mt-4 relative rounded-lg overflow-hidden shadow-lg dark:shadow-gray-700">
              <img
                src={previewImage || url}
                alt={title || "Preview"}
                className="w-full h-48 object-cover rounded-lg"
              />
              {previewImage && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 text-white text-sm py-1 px-2">
                  Preview
                </div>
              )}
            </div>
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
          className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
        >
          {loading ? "Processing..." : $id ? "Update" : "Submit"}
        </Button>
        {error && <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>}
      </div>
    </form>
  );
}
