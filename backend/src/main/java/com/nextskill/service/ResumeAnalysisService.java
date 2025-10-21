package com.nextskill.service;

import com.nextskill.model.ResumeUpload;
import com.nextskill.model.User;
import com.nextskill.repository.ResumeUploadRepository;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.ContentHandler;

import java.io.InputStream;

@Service
    public class ResumeAnalysisService {
    private final ResumeUploadRepository resumeRepo;

        public ResumeAnalysisService(ResumeUploadRepository resumeRepo) {
            this.resumeRepo = resumeRepo;
        }

        public String extractText(MultipartFile file) {
            try (InputStream in = file.getInputStream()) {
                ContentHandler handler = new BodyContentHandler(-1);
                Metadata metadata = new Metadata();
                AutoDetectParser parser = new AutoDetectParser();
                parser.parse(in, handler, metadata, new ParseContext());
                String text = handler.toString();
                return text == null ? "" : text.trim();
            } catch (Exception e) {
                return ""; // keep robust; log in real app
            }
        }

        public ResumeUpload saveUpload(User user, MultipartFile file, String extractedText) {
            ResumeUpload ru = new ResumeUpload();
            ru.setUser(user);
            ru.setFilename(file.getOriginalFilename());
            ru.setExtractedText(extractedText);
            return resumeRepo.save(ru);
        }
    }
