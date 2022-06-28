import { Controller, ControllerProps } from 'react-hook-form'
import { Autocomplete, AutocompleteProps, Checkbox, TextField, TextFieldProps } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

export type AutocompleteElementProps<T, M extends boolean | undefined, D extends boolean | undefined> = {
  name: string
  options: T[]
  loading?: boolean
  multiple?: M
  control?: ControllerProps['control']
  rules?: ControllerProps['rules']
  required?: boolean
  label?: TextFieldProps['label']
  showCheckbox?: boolean
  autocompleteProps?: Omit<AutocompleteProps<T, M, D, any>, 'name' | 'options' | 'loading' | 'renderInput'>
  textFieldProps?: Omit<TextFieldProps, 'name' | 'required' | 'label'>
}

type AutoDefault = {
  id: string | number
  label: string
}

export default function AutocompleteElement({
  textFieldProps,
  autocompleteProps,
  name,
  control,
  options,
  loading,
  showCheckbox,
  rules,
  required,
  multiple,
  label
}: AutocompleteElementProps<AutoDefault | string | any, boolean | undefined, boolean | undefined>) {
  const validationRules: ControllerProps['rules'] = {
    ...rules,
    ...(required && {
      required: rules?.required || 'This field is required'
    })
  }
  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...autocompleteProps}
          loading={loading}
          multiple={multiple}
          value={multiple ?
            field.value?.map((i: any) => options.find((j) => (j.id || j) === i)) ?? [] :
            options.find((i) => (i.id || i) === field.value) || null}
          options={options}
          disableCloseOnSelect={typeof autocompleteProps?.disableCloseOnSelect === 'boolean' ? autocompleteProps.disableCloseOnSelect : !!multiple}
          isOptionEqualToValue={autocompleteProps?.isOptionEqualToValue ?
            autocompleteProps.isOptionEqualToValue :
            (option, value) => {
              return value ? option.id === (value?.id || value) : false
            }}
          getOptionLabel={autocompleteProps?.getOptionLabel ?
            autocompleteProps.getOptionLabel :
            (option) => {
              return `${option?.label || option}`
            }
          }
          onChange={(event, value, reason, details) => {
            const v = (Array.isArray(value)) ?
              value.map((i: any) => i?.id || i)
              : value.id || value
            field.onChange(v)
            if (autocompleteProps?.onChange) {
              autocompleteProps.onChange(event, value, reason, details)
            }
          }}
          renderOption={showCheckbox ? (props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                sx={{ marginRight: 1 }}
                checked={selected}
              />
              {autocompleteProps?.getOptionLabel?.(option) || option.label || option}
            </li>
          ) : undefined}
          onBlur={(event) => {
            field.onBlur()
            if (typeof autocompleteProps?.onBlur === 'function') {
              autocompleteProps.onBlur(event)
            }
          }}
          renderInput={(params) => (
            <TextField name={name}
                       required={rules?.required ? true : required}
                       label={label}
                       {...textFieldProps}
                       {...params}
                       error={!!error}
                       InputProps={{
                         ...params.InputProps,
                         endAdornment: (
                           <>
                             {loading ? <CircularProgress color="inherit" size={20} /> : null}
                             {params.InputProps.endAdornment}
                           </>
                         )
                       }}
                       helperText={error ? error.message : textFieldProps?.helperText}
            />
          )} />
      )} />
  )
}
