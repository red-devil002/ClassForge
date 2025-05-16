import ClassGraph from "@/components/classGraph";

const students = [
  { id: "1", name: "Alice", friends: "Bob,Charlie", disrespectful: "Eve" },
  { id: "2", name: "Bob", friends: "Alice", disrespectful: "" },
  { id: "3", name: "Charlie", friends: "", disrespectful: "Alice" },
  { id: "4", name: "Eve", friends: "", disrespectful: "" },
];

export default function ClassGraphPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Class Graph</h1>
      <ClassGraph students={students} />
    </div>
  );
}
