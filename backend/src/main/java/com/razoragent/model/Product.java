package com.razoragent.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    private String id;
    private String name;

    @Column(length = 2000)
    private String description;
    private String category;
    private BigDecimal price;
    private Integer inventory;
    private String brand;
    private String imageUrl;
    private Double rating;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> useCases = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> complementaryProductIds = new ArrayList<>();

    @Column(length = 1000)
    private String keyFeatures;

    public Product() {}

    public Product(String id, String name, String description, String category, BigDecimal price, Integer inventory, String brand, String imageUrl, Double rating, List<String> tags, List<String> useCases, List<String> complementaryProductIds, String keyFeatures) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.inventory = inventory;
        this.brand = brand;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.tags = tags != null ? tags : new ArrayList<>();
        this.useCases = useCases != null ? useCases : new ArrayList<>();
        this.complementaryProductIds = complementaryProductIds != null ? complementaryProductIds : new ArrayList<>();
        this.keyFeatures = keyFeatures;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getInventory() { return inventory; }
    public void setInventory(Integer inventory) { this.inventory = inventory; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public List<String> getUseCases() { return useCases; }
    public void setUseCases(List<String> useCases) { this.useCases = useCases; }

    public List<String> getComplementaryProductIds() { return complementaryProductIds; }
    public void setComplementaryProductIds(List<String> complementaryProductIds) { this.complementaryProductIds = complementaryProductIds; }

    public String getKeyFeatures() { return keyFeatures; }
    public void setKeyFeatures(String keyFeatures) { this.keyFeatures = keyFeatures; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String name;
        private String description;
        private String category;
        private BigDecimal price;
        private Integer inventory;
        private String brand;
        private String imageUrl;
        private Double rating;
        private List<String> tags = new ArrayList<>();
        private List<String> useCases = new ArrayList<>();
        private List<String> complementaryProductIds = new ArrayList<>();
        private String keyFeatures;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder inventory(Integer inventory) { this.inventory = inventory; return this; }
        public Builder brand(String brand) { this.brand = brand; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder rating(Double rating) { this.rating = rating; return this; }
        public Builder tags(List<String> tags) { this.tags = tags; return this; }
        public Builder useCases(List<String> useCases) { this.useCases = useCases; return this; }
        public Builder complementaryProductIds(List<String> complementaryProductIds) { this.complementaryProductIds = complementaryProductIds; return this; }
        public Builder keyFeatures(String keyFeatures) { this.keyFeatures = keyFeatures; return this; }

        public Product build() {
            return new Product(id, name, description, category, price, inventory, brand, imageUrl, rating, tags, useCases, complementaryProductIds, keyFeatures);
        }
    }
}
