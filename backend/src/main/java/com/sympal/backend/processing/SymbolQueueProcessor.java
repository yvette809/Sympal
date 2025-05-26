package com.sympal.backend.processing;

import com.sympal.backend.entities.Symbol;
import com.sympal.backend.entities.SymbolRequest;
import com.sympal.backend.repository.SymbolRepository;
import com.sympal.backend.repository.SymbolRequestRepository;
import com.sympal.backend.service.CloudinaryService;
import com.sympal.backend.service.DalleService;
import com.sympal.backend.service.SymbolService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SymbolQueueProcessor {

    private final SymbolRequestRepository requestRepo;
    private final SymbolRepository symbolRepo;
    //private final DalleService dalleService;
    private final SymbolService symbolService;
    @Autowired
    private CloudinaryService cloudinaryService;

    @Scheduled(fixedRate = 10000) // every 10 sec
    public void processQueue() {
        List<SymbolRequest> pending = requestRepo.findTop1ByStatus(SymbolRequest.SymbolStatus.PENDING);


        for (SymbolRequest request : pending) {
            try {
                String imageUrl = symbolService.generateSymbol(request.getDescription());
                byte[] imageBytes = symbolService.downloadImage(imageUrl);
                String fileName = UUID.randomUUID().toString();
                String uploadedUrl = cloudinaryService.uploadImage(imageBytes, fileName);

                // Store image URL in the request, not in Symbol
                request.setTempImageUrl(uploadedUrl); // <-- new field in SymbolRequest
                request.setStatus(SymbolRequest.SymbolStatus.READY_FOR_APPROVAL);
                requestRepo.save(request);

            } catch (Exception e) {
                request.setStatus(SymbolRequest.SymbolStatus.FAILED);
                requestRepo.save(request);
                e.printStackTrace();
            }
        }

    }
}

