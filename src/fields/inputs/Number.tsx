import React, { FunctionComponent } from 'react';

const InputNumber: FunctionComponent<any> = ({ options, value, onChange, errors, id, field, ...props }) => {
  const className = errors?.length
    ? 'w-full px-3 py-2 border border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md'
    : 'w-full px-3 py-2 border border-gray-300 sm:text-sm rounded-md';

  return (
    <div className="py-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {options.label || field.name}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          className={className}
          disabled={options.disabled}
          id={id}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder={options.placeholder || field.name}
          required={options.required}
          type="number"
          value={value || ''}
          step={options.step}
          {...props}
        />
      </div>
      {options.helper || field.description ? (
        <p className="mt-2 text-sm text-gray-500" id={`${id}:helper`}>
          {options.helper || field.description}
        </p>
      ) : null}
      {errors?.map((error: any) => (
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      ))}
    </div>
  );
};

export default InputNumber;
