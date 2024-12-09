import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import conf from '../conf/conf.js'

export default function RTE({ name, control, label, defaultValue = "" }) {

  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}
      <div style={{ minHeight: "400px" }}>
        <Controller
          name={name || "content"}
          control={control}
          render={({ field: { onChange } }) => {
            return (
              <Editor
                apiKey={conf.apiKeyTinyMce}
                initialValue={defaultValue}
                init={{
                  branding: false,
                  height: 400,
                  menubar: true,
                  plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                  content_style:
                    "body { font-family: Arial, sans-serif; font-size:14px }",
                }}
                onInit={() => {
                }}
                onEditorChange={(content) => {;
                  onChange(content);
                }}
              />
            );
          }}
        />
      </div>
    </div>
  );
}
