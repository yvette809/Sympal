package com.sympal.backend.processing;

import com.sympal.backend.entities.Symbol;
import com.sympal.backend.entities.SymbolRequest;
import com.sympal.backend.repository.SymbolRepository;
import com.sympal.backend.repository.SymbolRequestRepository;
import com.sympal.backend.service.DalleService;
import com.sympal.backend.service.SymbolService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


import java.util.List;

@Component
@RequiredArgsConstructor
public class SymbolQueueProcessor {

    private final SymbolRequestRepository requestRepo;
    private final SymbolRepository symbolRepo;
    private final DalleService dalleService;
    private final SymbolService symbolService;

    @Scheduled(fixedRate = 10000) // every 10 sec
    public void processQueue() {
        List<SymbolRequest> pending = requestRepo.findTop1ByStatus("PENDING");
        for (SymbolRequest request : pending) {
            try {
                //String imageUrl = dalleService.generateImage(request.getDescription());
                String imageUrl = symbolService.generateSymbol(request.getDescription());

                Symbol symbol = new Symbol();
                symbol.setDescription(request.getDescription());
                symbol.setImageUrl(imageUrl);
                symbol.setApproved(false);
                symbol = symbolRepo.save(symbol);

                request.setStatus("DONE");
                request.setSymbol(symbol);
                requestRepo.save(request);
            } catch (Exception e) {
                request.setStatus("FAILED");
                requestRepo.save(request);
                e.printStackTrace();
            }
        }
    }
}

