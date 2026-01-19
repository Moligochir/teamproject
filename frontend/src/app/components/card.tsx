type Dog = {
  id: string;
  name: string;
  type: string;
  breed: string;
  date: string;
  location: string;
  image: string;
};

export default function DogCard({ dog }: { dog: Dog }) {
  return (
    <div className="relative w-120 h-120 bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-md">
      <img src={dog.image} alt={dog.name} className="object-cover" />

      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium backdrop-blur-sm">
        {dog.type === "dog" ? "🐕 Нохой" : "🐱 Муур"}
      </div>

      <div className="absolute bottom-0 w-full bg-black/50 text-white backdrop-blur-sm p-3 flex flex-col gap-1">
        <h3 className="font-bold text-lg">{dog.name}</h3>
        <p className="text-sm">{dog.breed}</p>
        <p className="text-sm">{dog.location}</p>
        <span className="text-xs text-gray-300">{dog.date}</span>
      </div>
    </div>
  );
}
