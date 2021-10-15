import React, { FunctionComponent, useEffect, useState } from 'react';
import graphandClient from '../../lib/graphand';

const InputImage: FunctionComponent<any> = ({ options, value, onChange, errors, id, field }) => {
  const [preview, setPreview] = useState();

  const previewUrl = async (url: string) => {
    if (url) {
      const response = await fetch(url);
      const data = await response.blob();
      const metadata = {
        type: 'image/jpeg',
      };
      const previewFile = new File([data], `${id}.png`, metadata);
      const reader = new FileReader();

      // @ts-ignore
      reader.onload = (e) => setPreview(e.target.result);

      reader.readAsDataURL(previewFile);
      return previewFile;
    }
    setPreview(undefined);
    return null;
  };

  const loadPreview = async () => {
    if (!value) {
      setPreview(undefined);
      return;
    }

    if (value instanceof File) {
      const reader = new FileReader();

      // @ts-ignore
      reader.onload = (e) => setPreview(e.target.result);

      reader.readAsDataURL(value);
      return;
    }

    const Media = graphandClient.getModel('Media');
    let media;

    if (value?._id) {
      media = await value;
    } else {
      media = await Media.get(value);
    }

    if (media && media.url) {
      await previewUrl(media.url);
    }
  };

  useEffect(() => {
    loadPreview();
  }, [value]);

  useEffect(() => {
    previewUrl(options.url).then(onChange);
  }, [options?.url]);

  return (
    <div {...options}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {options.label || field.name}
      </label>
      {options.description ? <p className="text-sm text-gray-500">{options.description}</p> : null}
      <div className="flex items-center mt-2 space-x-4">
        <img
          className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 object-cover"
          src={preview || options.placeholder}
          alt={options.label || field.name}
        />
        <div className="flex items-center space-x-1">
          <label
            htmlFor={id}
            className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
          font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
          >
            {value ? "Modifier l'image" : 'Sélectionnez une image'}
            <input
              id={id}
              type="file"
              className="hidden"
              accept={options.accept || 'image/*'}
              onChange={(e) => {
                const newFile = e.target.files && e.target.files[0];
                onChange(newFile);
              }}
            />
          </label>
          {value ? (
            <div>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
          font-medium text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {errors.map((e: any) => (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {e.message}
        </p>
      ))}
    </div>
  );
};

export default InputImage;
