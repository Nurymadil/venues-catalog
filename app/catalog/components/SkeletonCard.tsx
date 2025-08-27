export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200"></div>
      
      {/* Content placeholder */}
      <div className="p-4">
        {/* Title placeholder */}
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        
        {/* Location placeholder */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        
        {/* Price placeholder */}
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        
        {/* Capacity placeholder */}
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        
        {/* Amenities placeholder */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
}