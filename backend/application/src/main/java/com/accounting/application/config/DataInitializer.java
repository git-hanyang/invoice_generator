package com.accounting.application.config;

import com.accounting.application.entity.Business;
import com.accounting.application.entity.User;
import com.accounting.application.repository.BusinessRepository;
import com.accounting.application.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        // Upsert KRS business (always sync all fields so new columns get populated)
        Business krs = businessRepository.findByCode("KRS").orElse(new Business());
        krs.setCode("KRS");
        krs.setName("KAJANG REPAIRS & SERVICE CENTRE");
        krs.setNameSecondary("加影汽車修理中心");
        krs.setAddress("23, Jalan Zamrud 1, Taman Zamrud, Batu 16, Jln. Semenyih, 43000 Kajang, Selangor.");
        krs.setTel("03-8736 8123");
        krs.setHandPhone("019-228 0492");
        krs.setHandPhone2("013-620 1168");
        krs.setGstRegNo("000957243392");
        krs.setSpecialtyEn("Specialist in Car Air-Cond., Car Wiring, Checking, Alternater, Starter & Engine.");
        krs.setSpecialtyZh("專修理汽車電器,冷氣,引擎與貴進口各國本地電池");
        final Business savedKrs = businessRepository.save(krs);
        log.info("KRS business upserted");

        // Ensure KRS user exists (upsert by username)
        userRepository.findByUsername("KRS").ifPresentOrElse(
            existing -> {
                if (existing.getBusiness() == null) {
                    existing.setBusiness(savedKrs);
                    userRepository.save(existing);
                }
            },
            () -> {
                User user = User.builder()
                        .username("KRS")
                        .password(passwordEncoder.encode("KRS123"))
                        .business(savedKrs)
                        .build();
                userRepository.save(user);
                log.info("Default user created: KRS / KRS123");
            }
        );
    }
}
