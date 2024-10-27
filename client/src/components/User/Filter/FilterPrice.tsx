// components/ProductFilters.tsx
import React, { useState, useEffect, useContext } from 'react';
import { FiledContext } from '../../../contexts/FiledsContext';
import { IFileds } from '../../../interfaces/IFileds';

const ProductFilters = () => {
    const { fileds, dispatch } = useContext(FiledContext);
    const [sortCriteria, setSortCriteria] = useState('priceAsc');
    const [products, setProducts] = useState<any[]>([]); // Cập nhật kiểu dữ liệu sản phẩm
    const [loading, setLoading] = useState(true); // Để hiển thị trạng thái tải dữ liệu

    // Hàm lấy dữ liệu sản phẩm từ API
    const fetchProducts = async () => {
        try {
            const response = await fetch('products/filter', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setProducts(data.products); // Giả sử dữ liệu trả về có định dạng { products: [...] }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(); // Gọi hàm khi component được mount
    }, []);

    // Function to handle filter by color
    const handleColorChange = (color: string) => {
        const updatedColor = fileds.color.includes(color)
            ? fileds.color.filter(c => c !== color)
            : [...fileds.color, color];
        dispatch({ type: 'SET_COLOR', payload: updatedColor });
    };

    // Function to handle filter by size
    const handleSizeChange = (size: string) => {
        const updatedSize = fileds.size.includes(size)
            ? fileds.size.filter(s => s !== size)
            : [...fileds.size, size];
        dispatch({ type: 'SET_SIZE', payload: updatedSize });
    };

    // Function to handle price range
    const handlePriceChange = (min: number, max: number) => {
        dispatch({ type: 'SET_PRICE_RANGE', payload: { min, max } });
    };

    // Handle sort criteria change
    const handleSortChange = (criteria: string) => {
        setSortCriteria(criteria);
    };

    // Sort products based on criteria
    useEffect(() => {
        let sortedProducts = [...products];
        if (sortCriteria === 'priceAsc') {
            sortedProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
        } else if (sortCriteria === 'priceDesc') {
            sortedProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
        } else if (sortCriteria === 'rating') {
            sortedProducts.sort((a, b) => b.rating - a.rating);
        }
        setProducts(sortedProducts);
    }, [sortCriteria]);

    const colorsAvailable = ['#F5E8C7', '#000000', '#FF9A76', '#A163F7', '#FFFFFF'];
    const sizesAvailable = ['S', 'M', 'L', 'XL'];

    if (loading) {
        return <div>Loading products...</div>; // Trạng thái tải
    }

    return (
        <div className="flex p-4">
            {/* Bộ lọc */}
            <aside className="w-1/4 p-4 bg-gray-100 h-screen overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Filter Products</h3>
                
                <fieldset className="mb-6">
                    <legend className="text-sm font-medium mb-2">Price</legend>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        onChange={(e) => handlePriceChange(0, +e.target.value)}
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none"
                    />
                    <span className="block text-sm mt-2">{`$0 - $${fileds.priceRange.max}`}</span>
                </fieldset>
                
                <fieldset className="mb-6">
                    <legend className="text-sm font-medium mb-2">Color</legend>
                    {colorsAvailable.map(color => (
                        <label key={color} className="block mb-2">
                            <input
                                type="checkbox"
                                value={color}
                                checked={fileds.color.includes(color)}
                                onChange={() => handleColorChange(color)}
                                className="mr-2"
                            />
                            <span style={{ backgroundColor: color }} className="inline-block w-4 h-4 border border-gray-300 rounded-full"></span>
                        </label>
                    ))}
                </fieldset>

                <fieldset>
                    <legend className="text-sm font-medium mb-2">Size</legend>
                    {sizesAvailable.map(size => (
                        <label key={size} className="block mb-2">
                            <input
                                type="checkbox"
                                value={size}
                                checked={fileds.size.includes(size)}
                                onChange={() => handleSizeChange(size)}
                                className="mr-2"
                            />
                            {size}
                        </label>
                    ))}
                </fieldset>
            </aside>

            {/* Sản phẩm và thanh sắp xếp */}
            <div className="flex-grow">
                {/* Thanh công cụ sắp xếp */}
                <div className="flex justify-between items-center p-4 bg-white shadow-md mb-4">
                    <span className="font-semibold">Sort by:</span>
                    <div className="space-x-4">
                        <button
                            onClick={() => handleSortChange('priceAsc')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Price ascending
                        </button>
                        <button
                            onClick={() => handleSortChange('priceDesc')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Price descending
                        </button>
                        <button
                            onClick={() => handleSortChange('rating')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Rating
                        </button>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="grid grid-cols-4 gap-4 p-4">
                    {products.map(product => (
                        <div key={product.id} className="border p-4 rounded-lg shadow-lg">
                            <img src={product.image} alt={product.name} className="mb-2 w-full h-40 object-cover rounded-md" />
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-gray-500">{`$${product.discountedPrice}`}</p>
                            <p className="text-yellow-500">{`${product.rating} ★`}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
