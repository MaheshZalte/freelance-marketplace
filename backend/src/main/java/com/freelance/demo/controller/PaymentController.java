package com.freelance.demo.controller;

import com.freelance.demo.dto.PaymentVerificationRequest;
import com.freelance.demo.entity.Payment;
import com.freelance.demo.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Value("${razorpay.key-id:rzp_test_SmSYhcKr4rYQhB}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:ToNrRr8G0C9gtt7aUU9roZ6H}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")

    @PreAuthorize("hasAuthority('CLIENT')")

    public Map<String, Object> createOrder(

            @RequestBody
            Map<String, Object> data

    ) throws Exception {

        int amount =
                Integer.parseInt(
                        data.get("amount").toString()
                );

        RazorpayClient razorpay = new RazorpayClient(
                razorpayKeyId,
                razorpayKeySecret
        );

        JSONObject orderRequest = new JSONObject();

        // Amount in paise
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_rcptid" + System.currentTimeMillis());

        Order order = razorpay.orders.create(orderRequest);

        return new JSONObject(order.toString()).toMap();
    }

    @PostMapping("/verify")
    public String verifyPayment(
            @RequestBody PaymentVerificationRequest request
    ) throws Exception {

        String data = request.getRazorpay_order_id()
                + "|"
                + request.getRazorpay_payment_id();

        Mac sha256Hmac = Mac.getInstance("HmacSHA256");

        SecretKeySpec secretKey =
                new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");

        sha256Hmac.init(secretKey);

        byte[] hash = sha256Hmac.doFinal(data.getBytes());

        StringBuilder hexString = new StringBuilder();

        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }

        String generatedSignature = hexString.toString();

        if (generatedSignature.equals(request.getRazorpay_signature())) {

            paymentService.savePayment(

                    request.getContractId(),

                    request.getRazorpay_order_id(),

                    request.getRazorpay_payment_id(),

                    request.getAmount()
            );

            paymentService.markContractPaid(
                    request.getContractId()
            );

            return "Payment verified and saved successfully";
        }

        return "Payment verification failed";
    }

    @GetMapping
    public List<Payment> getPaymentsForUser() {

        String email = (String)
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        String role =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();

        return paymentService
                .getPaymentsForUser(
                        email,
                        role
                );
    }
}
