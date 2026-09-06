package com.razoragent.service;

import com.razoragent.model.Product;
import com.razoragent.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class CatalogService {

    private static final Logger log = LoggerFactory.getLogger(CatalogService.class);
    private final ProductRepository productRepository;

    public CatalogService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostConstruct
    public void initCatalogSeed() {
        if (productRepository.count() >= 50) {
            log.info("Catalog already seeded with {} products.", productRepository.count());
            return;
        }

        log.info("Seeding 50+ merchant products into catalog...");
        List<Product> products = createCatalogProducts();
        productRepository.saveAll(products);
        log.info("Successfully seeded {} merchant products into database catalog.", products.size());
    }

    public List<Product> searchProducts(String query, BigDecimal maxPrice) {
        if ((query == null || query.isBlank()) && maxPrice == null) {
            return productRepository.findAll();
        }
        String cleanQuery = (query == null) ? "" : query.trim();
        return productRepository.searchProducts(cleanQuery, maxPrice);
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByIds(List<String> ids) {
        return productRepository.findAllById(ids);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    private List<Product> createCatalogProducts() {
        List<Product> list = new ArrayList<>();

        // Audio & Headphones
        list.add(Product.builder()
                .id("PROD-AUDIO-001")
                .name("Sony WH-CH720N Wireless ANC Headphones")
                .description("Lightweight active noise cancelling over-ear headphones with 35-hour battery life, Dual Noise Sensor technology, and crisp multipoint Bluetooth pairing.")
                .category("Audio")
                .price(new BigDecimal("4299"))
                .inventory(45)
                .brand("Sony")
                .rating(4.7)
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500")
                .tags(Arrays.asList("wireless", "noise cancelling", "headphones", "work from home", "bluetooth", "anc"))
                .useCases(Arrays.asList("work from home", "travel", "focus", "calls"))
                .complementaryProductIds(Arrays.asList("PROD-ACC-001", "PROD-ACC-002"))
                .keyFeatures("ANC Active Noise Cancellation, 35h battery life, Dual Microphone for calls")
                .build());

        list.add(Product.builder()
                .id("PROD-AUDIO-002")
                .name("JBL Tune 760NC Over-Ear Wireless Headphones")
                .description("Active noise cancelling headphones with JBL Pure Bass sound, hands-free call support, and 44h battery duration with ANC on.")
                .category("Audio")
                .price(new BigDecimal("4999"))
                .inventory(30)
                .brand("JBL")
                .rating(4.5)
                .imageUrl("https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500")
                .tags(Arrays.asList("wireless", "headphones", "jbl", "bass", "anc"))
                .useCases(Arrays.asList("music", "work from home", "gym"))
                .complementaryProductIds(Arrays.asList("PROD-ACC-001", "PROD-ACC-003"))
                .keyFeatures("JBL Pure Bass Sound, 44h battery life, Multipoint Connection")
                .build());

        list.add(Product.builder()
                .id("PROD-AUDIO-003")
                .name("Sennheiser HD 450BT Wireless Noise Cancelling Headphones")
                .description("Premium German audio engineering with active noise cancellation, AAC and AptX Low Latency codec support.")
                .category("Audio")
                .price(new BigDecimal("7999"))
                .inventory(20)
                .brand("Sennheiser")
                .rating(4.8)
                .imageUrl("https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500")
                .tags(Arrays.asList("wireless", "premium", "sennheiser", "audiophile"))
                .useCases(Arrays.asList("audiophile listening", "studio work", "travel"))
                .complementaryProductIds(Arrays.asList("PROD-ACC-001", "PROD-ACC-002"))
                .keyFeatures("AptX Low Latency, Podcast mode, Smart Control App")
                .build());

        list.add(Product.builder()
                .id("PROD-AUDIO-004")
                .name("boAt Airdopes 141 TWS Earbuds")
                .description("True wireless earbuds with 42 hours playback time, ENx technology for clear voice calls, and IPX4 water resistance.")
                .category("Audio")
                .price(new BigDecimal("1299"))
                .inventory(120)
                .brand("boAt")
                .rating(4.2)
                .imageUrl("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500")
                .tags(Arrays.asList("earbuds", "tws", "budget", "wireless"))
                .useCases(Arrays.asList("budget shopping", "daily commute", "workouts"))
                .complementaryProductIds(Arrays.asList("PROD-ACC-003"))
                .keyFeatures("42h Playtime, ENx Call Clarity, Beast Mode low latency")
                .build());

        list.add(Product.builder()
                .id("PROD-AUDIO-005")
                .name("Sony WF-1000XM5 Premium Noise Cancelling Earbuds")
                .description("Industry-leading noise cancellation earbuds with High-Resolution Audio Wireless, Dynamic Driver X, and AI-based noise reduction algorithm.")
                .category("Audio")
                .price(new BigDecimal("19990"))
                .inventory(15)
                .brand("Sony")
                .rating(4.9)
                .imageUrl("https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500")
                .tags(Arrays.asList("premium", "anc", "earbuds", "sony", "high-res"))
                .useCases(Arrays.asList("premium listening", "executive travel", "wfh"))
                .complementaryProductIds(Arrays.asList("PROD-ACC-002"))
                .keyFeatures("HD Noise Cancelling Processor QN2e, Precise Voice Pickup, Wireless Charging")
                .build());

        // Accessories & Protection
        list.add(Product.builder()
                .id("PROD-ACC-001")
                .name("Hard Shell Headphone Carrying Case")
                .description("Shockproof EVA travel case with soft velour lining, cable storage mesh pocket, and universal fit for over-ear headphones.")
                .category("Accessories")
                .price(new BigDecimal("500"))
                .inventory(150)
                .brand("RazorGuard")
                .rating(4.6)
                .imageUrl("https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500")
                .tags(Arrays.asList("case", "protection", "travel", "headphone case", "accessory"))
                .useCases(Arrays.asList("headphone protection", "travel", "storage"))
                .complementaryProductIds(Arrays.asList("PROD-AUDIO-001", "PROD-AUDIO-002", "PROD-AUDIO-003"))
                .keyFeatures("Water-resistant nylon shell, Mesh cable pocket, Carabiner clip included")
                .build());

        list.add(Product.builder()
                .id("PROD-ACC-002")
                .name("RazorCare 2-Year Extended Hardware Warranty")
                .description("Comprehensive extended coverage protecting against accidental drops, liquid spills, battery degradation, and mechanical failures.")
                .category("Accessories")
                .price(new BigDecimal("499"))
                .inventory(999)
                .brand("RazorCare")
                .rating(4.9)
                .imageUrl("https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500")
                .tags(Arrays.asList("warranty", "protection", "insurance", "upsell"))
                .useCases(Arrays.asList("peace of mind", "device insurance"))
                .complementaryProductIds(Arrays.asList("PROD-AUDIO-001", "PROD-AUDIO-003", "PROD-AUDIO-005", "PROD-GAMING-001"))
                .keyFeatures("Zero-deductible replacement, Free doorstep pickup, 24/7 priority support")
                .build());

        list.add(Product.builder()
                .id("PROD-ACC-003")
                .name("Premium Braided Type-C Fast Charging Cable (2m)")
                .description("Ultra-durable nylon braided USB-C cable supporting 100W Power Delivery and high-speed data sync.")
                .category("Accessories")
                .price(new BigDecimal("399"))
                .inventory(200)
                .brand("RazorTech")
                .rating(4.7)
                .imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500")
                .tags(Arrays.asList("cable", "charger", "type-c", "accessory"))
                .useCases(Arrays.asList("fast charging", "desk setup", "travel"))
                .complementaryProductIds(Arrays.asList("PROD-AUDIO-001", "PROD-AUDIO-004", "PROD-OFFICE-001"))
                .keyFeatures("100W PD Fast Charge, 25,000+ bend lifespan, Aluminum alloy shell")
                .build());

        list.add(Product.builder()
                .id("PROD-ACC-004")
                .name("Ergonomic Aluminium Laptop Stand")
                .description("Adjustable desktop laptop riser made from premium aerospace aluminum with heat dissipation vents.")
                .category("Accessories")
                .price(new BigDecimal("1499"))
                .inventory(60)
                .brand("RazorDesk")
                .rating(4.8)
                .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500")
                .tags(Arrays.asList("laptop stand", "desk accessory", "ergonomic", "wfh"))
                .useCases(Arrays.asList("work from home", "office setup", "posture"))
                .complementaryProductIds(Arrays.asList("PROD-OFFICE-001", "PROD-OFFICE-002"))
                .keyFeatures("6-level height adjustment, Anti-slip silicone pads, Foldable design")
                .build());

        // Office & Work From Home Setups
        list.add(Product.builder()
                .id("PROD-OFFICE-001")
                .name("Logitech MX Master 3S Wireless Performance Mouse")
                .description("Quiet click ergonomic mouse with 8K DPI tracking on glass, MagSpeed electromagnetic scrolling, and USB-C quick charge.")
                .category("Office")
                .price(new BigDecimal("8995"))
                .inventory(35)
                .brand("Logitech")
                .rating(4.9)
                .imageUrl("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500")
                .tags(Arrays.asList("mouse", "logitech", "mx master", "ergonomic", "wfh"))
                .useCases(Arrays.asList("work from home", "productivity", "design"))
                .complementaryProductIds(Arrays.asList("PROD-OFFICE-002", "PROD-ACC-004"))
                .keyFeatures("8,000 DPI sensor, 90% quieter clicks, MagSpeed scroll wheel")
                .build());

        list.add(Product.builder()
                .id("PROD-OFFICE-002")
                .name("Logitech MX Keys S Wireless Illuminated Keyboard")
                .description("Advanced low-profile wireless keyboard with smart backlighting, customizable Smart Actions, and quiet mechanical feel.")
                .category("Office")
                .price(new BigDecimal("11995"))
                .inventory(25)
                .brand("Logitech")
                .rating(4.8)
                .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500")
                .tags(Arrays.asList("keyboard", "logitech", "wireless", "wfh"))
                .useCases(Arrays.asList("work from home", "coding", "typing"))
                .complementaryProductIds(Arrays.asList("PROD-OFFICE-001", "PROD-ACC-004"))
                .keyFeatures("Smart Backlighting, Multi-device switching, Smart Action macros")
                .build());

        list.add(Product.builder()
                .id("PROD-OFFICE-003")
                .name("Anker PowerConf C200 2K Webcam")
                .description("Ultra-clear 2K HD webcam with dual stereo noise-cancelling microphones and auto-focus AI lens.")
                .category("Office")
                .price(new BigDecimal("4499"))
                .inventory(40)
                .brand("Anker")
                .rating(4.6)
                .imageUrl("https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500")
                .tags(Arrays.asList("webcam", "video calls", "zoom", "wfh", "anker"))
                .useCases(Arrays.asList("work from home", "video conferences", "streaming"))
                .complementaryProductIds(Arrays.asList("PROD-AUDIO-001", "PROD-OFFICE-004"))
                .keyFeatures("2K HD resolution, Dual Noise-cancelling Mic, Built-in Privacy Cover")
                .build());

        list.add(Product.builder()
                .id("PROD-OFFICE-004")
                .name("Ergonomic Lumbar Support Office Desk Chair")
                .description("Breathable mesh high-back office chair with 3D adjustable armrests and dynamic lumbar cushion support.")
                .category("Office")
                .price(new BigDecimal("14999"))
                .inventory(18)
                .brand("GreenSoul")
                .rating(4.7)
                .imageUrl("https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500")
                .tags(Arrays.asList("chair", "ergonomic", "furniture", "wfh"))
                .useCases(Arrays.asList("work from home", "long seating", "office"))
                .complementaryProductIds(Arrays.asList("PROD-ACC-004", "PROD-OFFICE-001"))
                .keyFeatures("3D Armrests, Synchro-tilt lock mechanism, Heavy-duty metal base")
                .build());

        // Gaming Setups
        list.add(Product.builder()
                .id("PROD-GAMING-001")
                .name("ASUS ROG Strix G16 Gaming Laptop")
                .description("Intel Core i7-13650HX, NVIDIA GeForce RTX 4060, 16GB DDR5 RAM, 1TB NVMe SSD, 16-inch 165Hz FHD+ Display.")
                .category("Gaming")
                .price(new BigDecimal("89990"))
                .inventory(8)
                .brand("ASUS")
                .rating(4.9)
                .imageUrl("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500")
                .tags(Arrays.asList("gaming laptop", "rtx 4060", "rog", "asus", "gaming setup"))
                .useCases(Arrays.asList("gaming setup", "esports", "3d rendering"))
                .complementaryProductIds(Arrays.asList("PROD-GAMING-002", "PROD-GAMING-003", "PROD-ACC-002"))
                .keyFeatures("RTX 4060 8GB GPU, Tri-Fan Cooling System, Aura Sync RGB")
                .build());

        list.add(Product.builder()
                .id("PROD-GAMING-002")
                .name("Razer BlackShark V2 Pro Wireless Gaming Headset")
                .description("Esports Wireless Gaming Headset with HyperClear Superwide Band Mic and TriForce Titanium 50mm Drivers.")
                .category("Gaming")
                .price(new BigDecimal("9499"))
                .inventory(22)
                .brand("Razer")
                .rating(4.7)
                .imageUrl("https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500")
                .tags(Arrays.asList("gaming headset", "razer", "wireless", "esports"))
                .useCases(Arrays.asList("gaming setup", "discord", "esports"))
                .complementaryProductIds(Arrays.asList("PROD-GAMING-003", "PROD-ACC-001"))
                .keyFeatures("Razer HyperSpeed Wireless, THX Spatial Audio, 70-hour battery life")
                .build());

        list.add(Product.builder()
                .id("PROD-GAMING-003")
                .name("LG UltraGear 27-inch QHD IPS 165Hz Gaming Monitor")
                .description("1440p Nano IPS Gaming Monitor with 1ms response time, NVIDIA G-Sync Compatibility, and HDR10 support.")
                .category("Gaming")
                .price(new BigDecimal("22499"))
                .inventory(12)
                .brand("LG")
                .rating(4.8)
                .imageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500")
                .tags(Arrays.asList("monitor", "165hz", "qhd", "lg ultragear", "gaming setup"))
                .useCases(Arrays.asList("gaming setup", "dual monitor", "creative work"))
                .complementaryProductIds(Arrays.asList("PROD-GAMING-001", "PROD-GAMING-004"))
                .keyFeatures("QHD 2560x1440 resolution, 1ms Motion Blur Reduction, G-Sync Compatible")
                .build());

        list.add(Product.builder()
                .id("PROD-GAMING-004")
                .name("Razer DeathAdder V3 Pro Wireless Ergonomic Gaming Mouse")
                .description("Ultra-lightweight 63g esports gaming mouse with Focus Pro 30K Optical Sensor and 90-hour battery life.")
                .category("Gaming")
                .price(new BigDecimal("7999"))
                .inventory(30)
                .brand("Razer")
                .rating(4.8)
                .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500")
                .tags(Arrays.asList("gaming mouse", "razer", "esports", "wireless"))
                .useCases(Arrays.asList("gaming setup", "competitive gaming"))
                .complementaryProductIds(Arrays.asList("PROD-GAMING-001", "PROD-GAMING-002"))
                .keyFeatures("63g ultra-lightweight, 30K DPI Optical Sensor, Gen-3 Optical Switches")
                .build());

        // Gifts & Lifestyle
        list.add(Product.builder()
                .id("PROD-GIFT-001")
                .name("Smart Fitness Band 8 with AMOLED Display")
                .description("Fitness tracker with 1.62\" AMOLED screen, SpO2 monitoring, 150+ sports modes, and 16 days battery life. Ideal birthday gift for brother or friend!")
                .category("Fitness")
                .price(new BigDecimal("2499"))
                .inventory(80)
                .brand("FitMax")
                .rating(4.6)
                .imageUrl("https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500")
                .tags(Arrays.asList("gift", "fitness band", "birthday gift", "smartwatch", "under 3000"))
                .useCases(Arrays.asList("birthday gift for brother", "gift under 3000", "fitness"))
                .complementaryProductIds(Arrays.asList("PROD-ACC-003", "PROD-GIFT-002"))
                .keyFeatures("1.62 inch AMOLED, SpO2 & Heart Rate 24/7, 5ATM Water Resistant")
                .build());

        list.add(Product.builder()
                .id("PROD-GIFT-002")
                .name("Marshall Style Vintage Bluetooth Speaker (10W)")
                .description("Retro compact portable Bluetooth speaker with deep bass, brass control knobs, and textured leatherette finish.")
                .category("Audio")
                .price(new BigDecimal("2899"))
                .inventory(40)
                .brand("SoundCraft")
                .rating(4.7)
                .imageUrl("https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500")
                .tags(Arrays.asList("gift", "speaker", "bluetooth speaker", "birthday gift", "under 3000"))
                .useCases(Arrays.asList("birthday gift for brother", "music lover", "room decor"))
                .complementaryProductIds(Arrays.asList("PROD-ACC-003"))
                .keyFeatures("Retro leatherette design, 12h battery, Dual bass passive radiators")
                .build());

        list.add(Product.builder()
                .id("PROD-GIFT-003")
                .name("Premium Leather Wallet & Keyring Gift Set")
                .description("Handcrafted genuine RFID-blocking leather bifold wallet paired with an alloy carabiner key holder in a luxurious gift box.")
                .category("Accessories")
                .price(new BigDecimal("1899"))
                .inventory(65)
                .brand("UrbanCraft")
                .rating(4.8)
                .imageUrl("https://images.unsplash.com/photo-1627123424574-724758594e93?w=500")
                .tags(Arrays.asList("gift", "wallet", "brother gift", "leather", "gift set"))
                .useCases(Arrays.asList("birthday gift for brother", "anniversary", "men accessories"))
                .complementaryProductIds(Arrays.asList("PROD-GIFT-001"))
                .keyFeatures("RFID blocking technology, 100% Genuine Top Grain Leather, Gift packaging")
                .build());

        for (int i = 1; i <= 32; i++) {
            String category = (i % 5 == 0) ? "Fitness" : (i % 4 == 0) ? "Gaming" : (i % 3 == 0) ? "Office" : (i % 2 == 0) ? "Electronics" : "Audio";
            BigDecimal price = new BigDecimal(300 + (i * 250));
            list.add(Product.builder()
                    .id(String.format("PROD-CAT-%03d", i))
                    .name(category + " Essential Item #" + i)
                    .description("High-performance merchant item designed for daily use and productivity in category " + category)
                    .category(category)
                    .price(price)
                    .inventory(20 + (i * 3))
                    .brand("RazorBrand")
                    .rating(4.0 + (i % 10) * 0.1)
                    .imageUrl("https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500")
                    .tags(Arrays.asList(category.toLowerCase(), "merchant item", "gadget", "accessory"))
                    .useCases(Arrays.asList("daily use", category.toLowerCase() + " setup"))
                    .complementaryProductIds(Arrays.asList("PROD-ACC-001", "PROD-ACC-002"))
                    .keyFeatures("High quality, Durable construction, 1-year merchant warranty")
                    .build());
        }

        return list;
    }
}
