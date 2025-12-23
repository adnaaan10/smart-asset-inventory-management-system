import {Table,TableHead,TableBody,TableRow,TableCell,Paper} from "@mui/material";


const CustomTable = ({columns,data}) =>{
    return(
        <Paper sx={{padding:2}}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((col)=>(
                            <TableCell key={col}>{col}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map((row,idx)=>(
                        <TableRow key={idx}>
                            {Object.values(row).map((value,indx)=>(
                                <TableCell key={indx}>{value}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </Paper>

    )
}

export default CustomTable