import { Button } from '@material-ui/core';

export default function MyButton({ onClick, name }) {
  return (
    <Button fullWidth style={{ margin: '15px 0' }} variant='contained' color='primary' onClick={onClick}>
      {name}
    </Button>
  );
}
