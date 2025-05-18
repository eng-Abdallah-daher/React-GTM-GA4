import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Divider,
  styled,
  Button,
  CardActionArea,
  CardActions
} from '@mui/material';
import { addToCart } from '../../redux/slices/cartSlice';
import Heart from './HeartButton';
import { trackGTMEvent } from '../../utils/gtmUtils';

const ProductCardStyled = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  }
}));
const SwatchButton = styled('button')(({ theme, selected }) => ({
  width: 30,
  height: 30,
  borderRadius: '50%',
  cursor: 'pointer',
  margin: theme.spacing(0, 0.5),
  padding: 0,
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  '&:hover, &:focus': {
    border: `2px solid ${theme.palette.primary.main}`,
    outline: 'none'
  }
}));
const SwatchImage = styled('img')({
  width: 24,
  height: 24,
  borderRadius: '50%',
  pointerEvents: 'none'
});
const FilterLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem'
}));
const QuickShopButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 0,
  padding: theme.spacing(1),
  transform: 'translateY(100%)',
  transition: 'transform 0.3s',
  '.MuiCardMedia-root:hover &, &:focus': {
    transform: 'translateY(0)',
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`
  }
}));
const HeartContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 1
}));
export default function ProductCard({ idx, product, setSwatchSel, imgSrc, sel }) {
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    const item = {
      id: idx,
      name: product.productName,
      price: product.productPrice,
      image: imgSrc,
      variant: product.swatches ? product.swatches[sel].swatchName : null
    };

    dispatch(addToCart({
      item,
      quantity: 1
    }));

    trackGTMEvent('add_to_cart', {
      method: 'Buy Button',
      user_type: 'guest',
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: 1,
      item_variant: item.variant || ''
    });
  };
  return (
    <ProductCardStyled elevation={1}>
      <Box sx={{ position: 'relative' }}>
        <HeartContainer>
          <Heart productIndex={idx} />
        </HeartContainer>
        <CardActionArea
          component={Link}
          to={`/products?id=${idx}`}
          aria-label={`View details of ${product.productName}`}
          onClick={() => trackGTMEvent('select_item', {
            method: 'Product Click',
            user_type: 'guest',
            item_id: product.productID || idx,
            item_name: product.productName,
            price: product.productPrice,
            item_variant: product.swatches ? product.swatches[sel].swatchName : ''
          })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              trackGTMEvent('select_item', {
                method: 'Product Click',
                user_type: 'guest',
                item_id: product.productID || idx,
                item_name: product.productName,
                price: product.productPrice,
                item_variant: product.swatches ? product.swatches[sel].swatchName : ''
              });
              window.location.href = `/products?id=${idx}`;
            }
          }}
        >
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="200"
              image={imgSrc}
              alt={product.productName}
              sx={{ objectFit: 'cover' }}
            />
            <QuickShopButton
              variant="text"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAddToCart();
                }
              }}
              aria-label="Quick add to cart"
              tabIndex="0"
            >
              Quick Shop
            </QuickShopButton>
          </Box>
        </CardActionArea>
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <FilterLabel>
          <Divider sx={{ flex: 1, mr: 1 }} />
          <Typography variant="caption">
            Filter <span style={{ color: 'gray' }}>104 Times</span>
          </Typography>
          <Divider sx={{ flex: 1, ml: 1 }} />
        </FilterLabel>
        <Typography
          variant="h6"
          component={Link}
          to={`/products?id=${idx}`}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            display: 'block',
            mb: 1,
            '&:hover, &:focus': {
              color: 'primary.main',
              outline: 'none'
            }
          }}
          aria-label={`View details of ${product.productName}`}
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              window.location.href = `/products?id=${idx}`;
            }
          }}
        >
          {product.productName}
        </Typography>
        <Typography variant="subtitle1" color="primary" fontWeight="bold">
          {product.productPriceFormatted}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.productName} {sel + 1} selected
        </Typography>
        {product.swatches && (
          <Box sx={{ display: 'flex', mt: 1 }} role="group" aria-label="Color options">
            {product.swatches.slice(0, 3).map((swatch, j) => (
              <SwatchButton
                key={j}
                selected={j === sel}
                onClick={(e) => {
                  e.stopPropagation();
                  setSwatchSel(s => ({ ...s, [idx]: j }));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSwatchSel(s => ({ ...s, [idx]: j }));
                  }
                }}
                aria-label={`Select color: ${swatch.swatchName}`}
                aria-pressed={j === sel}
                tabIndex="0"
              >
                <SwatchImage
                  src={swatch.img.src}
                  alt=""
                />
              </SwatchButton>
            ))}
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddToCart}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAddToCart();
            }
          }}
          aria-label={`Add ${product.productName} to cart`}
        >
          Add to Cart
        </Button>
      </CardActions>
    </ProductCardStyled>
  );
}
