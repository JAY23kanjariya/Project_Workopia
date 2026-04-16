export default function Loader({ text = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500 font-medium">{text}</p>
        </div>
    );
}