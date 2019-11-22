import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Image from "material-ui-image";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { fetchItem } from "src/actions/items";
import { useItem } from "src/selectors/items";
import CenteredCircularProgress from "src/components/common/CenteredCircularProgress";
import AddToCartButton from "../shoppingCart/AddToCartButton";
import ItemCard from "src/components/items/ItemCard";
import ReviewList from "../reviews/ReviewList";

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: "1em"
    },
    image: {
        flex: "0 1 250px",
        margin: "1em"
    }
}));

const FullCategory = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { itemId } = useParams();
    const item = useItem(itemId);

    useEffect(() => {
        dispatch(fetchItem(itemId));
    }, [dispatch, itemId]);

    const renderBundle = () => {
        if (item.items) {
            return (
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5" className={classes.title}>
                            In this bundle:
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container justify="space-evenly" spacing={0}>
                            {item.items.map(item => (
                                <ItemCard key={item._id} item={item} />
                            ))}
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            );
        }
    };

    if (!item) return <CenteredCircularProgress />;

    return (
        <>
            <Grid container item className={classes.container}>
                <Grid item className={classes.image}>
                    <Image src={item.image} />
                </Grid>

                <Grid
                    item
                    container
                    direction="column"
                    spacing={1}
                    alignItems="flex-start"
                    xs
                >
                    <Grid
                        item
                        component={Typography}
                        variant="h4"
                        className={classes.title}
                    >
                        {item.title}
                    </Grid>
                    <Grid item component={Typography} variant="subtitle1">
                        Price: {item.price} <AddToCartButton item={item} />
                    </Grid>
                    <Grid
                        item
                        component={Typography}
                        variant="body1"
                        align="justify"
                    >
                        {item.description}
                    </Grid>
                </Grid>
            </Grid>
            {renderBundle()}
            <ReviewList reviews={item.reviews} />
        </>
    );
};

export default FullCategory;
