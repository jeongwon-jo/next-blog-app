import { createClient } from "@/utils/supabase/server";
import formidable from "formidable";
import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).end();

  const supabase = createClient(req.cookies);

  if (req.method === "DELETE") {
    const { error } = await supabase.from("Post").delete().eq("id", id);
    if (error) return res.status(500).end();
    return res.status(200).end();
  }

  if (req.method === "PUT") {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    let preview_image_url: string | undefined = undefined;

    if (files.preview_image?.length === 1) {
      const file = files.preview_image[0];
      const fileContent = readFileSync(file.filepath);
      const fileName = `${file.newFilename}_${file.originalFilename}`;

      const { data: uploadData, error } = await supabase.storage
        .from("blog-image")
        .upload(fileName, fileContent, { contentType: file.mimetype ?? undefined });

      if (error) return res.status(403).end();

      if (uploadData?.path) {
        const { data } = supabase.storage.from("blog-image").getPublicUrl(uploadData.path);
        preview_image_url = data.publicUrl;
      }
    }

    const updateData: Record<string, unknown> = {
      title: fields.title?.[0],
      category: fields.category?.[0],
      tags: fields.tags?.[0],
      content: fields.content?.[0],
    };
    if (preview_image_url !== undefined) {
      updateData.preview_image_url = preview_image_url;
    } else if (fields.remove_image?.[0] === "true") {
      updateData.preview_image_url = null;
    }

    const { error } = await supabase.from("Post").update(updateData).eq("id", id);
    if (error) return res.status(500).end();
    return res.status(200).end();
  }

  return res.status(405).end();
}
