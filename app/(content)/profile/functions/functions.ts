export const CheckFunction = ({ checked, checkedAmt, index }: { checked: boolean[], checkedAmt: number, index: number }) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];

    const newCheckedAmt = newChecked[index] ? checkedAmt + 1 : checkedAmt - 1;

    return { newChecked, newCheckedAmt };
};