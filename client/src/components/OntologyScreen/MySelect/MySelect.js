import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

export default function MySelect({ id, emptyText, name, list = [], onChange, value }) {
  return (
    <FormControl style={{ margin: '15px 0' }} fullWidth>
      <InputLabel shrink id={id + '-label'}>
        { name }
      </InputLabel>
      <Select
        margin='dense'
        labelId='scenarioSelect-label'
        id={id}
        value={value}
        displayEmpty={emptyText}
        onChange={onChange}
      >
        {emptyText && <MenuItem value={''}>{emptyText}</MenuItem>}
        {list.map((v, i) => (
          <MenuItem key={i} value={v}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
