package com.example.PlataformaEventos.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

public final class QrCodeUtils {

    private static final int WIDTH = 300;
    private static final int HEIGHT = 300;

    private QrCodeUtils() {
    }

    public static String generate(String content) {

        try {
            QRCodeWriter writer = new QRCodeWriter();

            BitMatrix bitMatrix = writer.encode(
                    content,
                    BarcodeFormat.QR_CODE,
                    WIDTH,
                    HEIGHT
            );

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            MatrixToImageWriter.writeToStream(
                    bitMatrix,
                    "PNG",
                    outputStream
            );

            return Base64.getEncoder()
                    .encodeToString(outputStream.toByteArray());

        } catch (WriterException | IOException e) {
            throw new RuntimeException(
                    "Erro ao gerar QR Code",
                    e
            );
        }
    }
}
