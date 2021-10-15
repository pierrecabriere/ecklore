import React, { FunctionComponent } from 'react';

const InputText: FunctionComponent<any> = ({ options, value, onChange, errors, id, field, ...props }) => {
  const className = errors?.length
    ? 'w-full px-3 py-2 border border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md'
    : 'w-full px-3 py-2 border border-gray-300 sm:text-sm rounded-md';

  const renderInputContent = () => {
    switch (options.type) {
      case 'textarea':
        return (
          <textarea
            className={className}
            disabled={options.disabled}
            id={id}
            onChange={(e) => onChange(e.currentTarget.value)}
            placeholder={options.placeholder || field.name}
            required={options.required}
            value={value || ''}
            {...props}
          />
        );
      default:
        return (
          <input
            className={className}
            disabled={options.disabled}
            id={id}
            onChange={(e) => onChange(e.currentTarget.value)}
            placeholder={options.placeholder || field.name}
            required={options.required}
            type={options.type || 'text'}
            value={value || ''}
            step={options.step}
            {...props}
          />
        );
    }
  };

  return (
    <div className="py-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {options.label || field.name}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">{renderInputContent()}</div>
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

export default InputText;
