// import { Button } from "@material-ui/core";
import Button from "@mui/material/Button";
import React from "react";
// import { makeStyles } from "@material-ui/core";

// const useStyles = makeStyles((theme) => ({
//   btnColor: {
//     color: "white",
//     backgroundColor: theme.palette.primary.main,
//     "&:hover": {
//       background: theme.palette.primary.main,
//     },
//   },
// }));

function CommonButton({
  // type,
  buttonName,
  // onClick,
  // size,
  // color,
  // disabled,
  // fullWidth,
  ...rest
}) {
  // const useStyles = makeStyles((theme) => ({
  //   btnColor: {
  //     backgroundColor: "blue",
  //   },
  // }));
  // const classes = useStyles();

  return (
    <div>
      <Button
        variant="contained"
        // type={type}
        // onClick={onClick}
        // size={size}
        // color={color}
        // disabled={disabled}
        fullWidth={true}
        // className={classes.btnColor}
        {...rest}
      >
        {buttonName}
      </Button>
    </div>
  );
}

export default CommonButton;
