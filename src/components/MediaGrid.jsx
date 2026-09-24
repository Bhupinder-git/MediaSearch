import MediaCard from "./MediaCard";
import { useDispatch } from "react-redux";
import {
  addItemToCollection,
  removeItemFromCollection,
} from "../redux/slices/collectionSlice";

function MediaGrid({ items, mode, savedIds = [] }) {
  // creating an instance of the dispatcher to dispatch action
  const dispatch = useDispatch();

  // Check
  if (items.length === 0) return null;

  // Different grid styling for different pages
  const gridClasses =
    mode === "collection"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter"
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter items-start";

  // Function to handle save
  const handleSave = (media) => {
    dispatch(addItemToCollection(media));
  };

  // Function to handle remove
  const handleRemove = (media) => {
    dispatch(removeItemFromCollection(media.id));
  };

  return (
    <div className={gridClasses}>
      {items.map((media) => (
        <MediaCard
          key={media.id}
          media={media}
          mode={mode}
          isSaved={savedIds.includes(media.id)}
          onSave={handleSave}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}

export default MediaGrid;
