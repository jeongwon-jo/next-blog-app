import { PostUpdate } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient(await cookies());
  const { error } = await supabase.from("Post").delete().eq("id", Number(id));
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ message: "success" }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient(await cookies());

  const formEntries = Array.from((await request.formData()).entries());
  const formData = formEntries.reduce<Record<string, FormDataEntryValue>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  const { preview_image, remove_image, ...fields } = formData as unknown as PostUpdate & {
    preview_image?: File;
    remove_image?: string;
  };

  let preview_image_url: string | null | undefined = undefined;

  if (preview_image instanceof File && preview_image.size > 0) {
    const fileName = `${preview_image.name}_${format(new Date(), "yyyyMMddHHmmss")}`;
    const { data: uploadData, error } = await supabase.storage
      .from("blog-image")
      .upload(fileName, preview_image, { contentType: preview_image.type });

    if (error) return Response.json({ error }, { status: 403 });

    if (uploadData?.path) {
      const { data } = supabase.storage.from("blog-image").getPublicUrl(uploadData.path);
      preview_image_url = data.publicUrl;
    }
  } else if (remove_image === "true") {
    preview_image_url = null;
  }

  const updateData: PostUpdate = { ...fields };
  if (preview_image_url !== undefined) {
    updateData.preview_image_url = preview_image_url;
  }

  const { error } = await supabase.from("Post").update(updateData).eq("id", Number(id));
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ message: "success" }, { status: 200 });
}
