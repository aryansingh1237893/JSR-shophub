import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { setProducts } from '../redux/store';

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState([]);
  const [todayDeals, setTodayDeals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [sellers, deals, recs] = await Promise.all([
        api.getProducts(1, 10, { bestSeller: true }),
        api.getProducts(1, 10, { deal: true }),
        api.getProducts(1, 10, { recommended: true }),
      ]);

      setBestSellers(sellers.products || []);
      setTodayDeals(deals.products || []);
      setRecommendations(recs.products || []);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProductCard = (product) => (
    <TouchableOpacity
      key={product._id}
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.productImage}
        defaultSource={require('../assets/placeholder.png')}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>
        <View style={styles.ratingRow}>
          <MaterialIcons name="star" size={16} color="#FFB800" />
          <Text style={styles.rating}>{product.rating} ({product.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#999" />
            <Text style={styles.searchPlaceholder}>Search products...</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.notificationIcon}
          onPress={() => navigation.navigate('Notifications')}
        >
          <MaterialIcons name="notifications" size={24} color="#FF9500" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Location Banner */}
      <View style={styles.locationBanner}>
        <MaterialIcons name="location-on" size={20} color="#FF9500" />
        <Text style={styles.locationText}>Deliver to 110001</Text>
        <MaterialIcons name="expand-more" size={20} color="#555" />
      </View>

      {/* Category Slider */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map((cat) => (
            <TouchableOpacity key={cat} style={styles.categoryCard}>
              <View style={styles.categoryIcon}>
                <MaterialIcons name="shopping-bag" size={24} color="#FF9500" />
              </View>
              <Text style={styles.categoryName}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Today's Deals */}
      {todayDeals.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="flash-on" size={20} color="#FF9500" />
            <Text style={styles.sectionTitle}>Today's Deals</Text>
          </View>
          <FlatList
            data={todayDeals}
            renderItem={({ item }) => renderProductCard(item)}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
          />
        </View>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Sellers</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={bestSellers}
            renderItem={({ item }) => renderProductCard(item)}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <FlatList
            data={recommendations}
            renderItem={({ item }) => renderProductCard(item)}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Advertisement Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Get ₹500 OFF on First Order</Text>
        <Text style={styles.bannerSubtext}>Use code: WELCOME500</Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: '#999',
    fontSize: 14,
  },
  notificationIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF9E6',
  },
  locationText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  section: {
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAll: {
    color: '#FF9500',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  productCard: {
    width: 180,
    marginRight: 12,
    marginLeft: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0F0F0',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  banner: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#FF9500',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default HomeScreen;
