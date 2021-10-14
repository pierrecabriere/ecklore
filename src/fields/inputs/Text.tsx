import React, { FunctionComponent } from 'react';

const InputText: FunctionComponent<any> = ({ options, value, onChange, errors, id, field, ...props }) => {
  const inputClass = () => {
    let classes = `form-control block max-w-lg w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500`;
    if (errors?.length) {
      classes += ' invalid ring-indigo-500 border-red-500';
    }
    return classes;
  };

  const renderInputContent = () => {
    switch (options.type) {
      case 'textarea':
        return (
          <textarea
            className={inputClass()}
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
            className={inputClass()}
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
    <div className="form-group sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
        {options.label || field.name}
      </label>
      {renderInputContent()}
      {options.helper || field.description ? (
        <small className="field-text mt-2 text-sm text-gray-500 italic" id={`${id}:helper`}>
          {options.helper || field.description}
        </small>
      ) : null}
      {errors?.map((error: any) => (
        <div className="invalid-feedback mt-2 text-sm text-red-600">{error.message}</div>
      ))}
    </div>
  );
};

export default InputText;
