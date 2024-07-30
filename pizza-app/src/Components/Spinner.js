export default function Spinner() {
    return (
        <div className="flex justify-center items-center space-x-2">
            <div className="h-2 w-2 bg-gray-900 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-gray-900 rounded-full animate-bounce delay-200"></div>
            <div className="h-2 w-2 bg-gray-900 rounded-full animate-bounce delay-400"></div>
        </div>
    );
}
