import supabase from "@/lib/supabase";

const tasks = supabase.from("tasks");

export const createTask = async (task: Task) => {
  const { data, error } = await tasks.insert(task);
}