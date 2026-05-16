package com.egekilavuz.economylab;

import android.util.Log;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private static final String TAG = "EconomyLab";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);

        // Enable remote debugging via Chrome DevTools
        WebView.setWebContentsDebuggingEnabled(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String path = uri.getPath();
                String host = uri.getHost();

                // Only handle localhost requests
                if (!"localhost".equals(host) && !"127.0.0.1".equals(host)) {
                    return null;
                }

                // Map /assets/... to assets/... in the APK
                // e.g. /assets/public/index.html -> assets/public/index.html
                if (path != null && path.startsWith("/assets/")) {
                    String assetPath = path.substring(1); // remove leading /
                    try {
                        InputStream is = getAssets().open(assetPath);
                        String mime = getMimeType(assetPath);
                        Log.d(TAG, "Serving: " + assetPath + " (" + mime + ")");
                        return new WebResourceResponse(mime, "UTF-8", is);
                    } catch (IOException e) {
                        Log.e(TAG, "Asset not found: " + assetPath);
                        return null;
                    }
                }
                return null;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }
        });

        // Swipe-back gesture
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    finish();
                }
            }
        });

        // Load app from local HTTP helper
        // index.html uses relative paths (./assets/...) from vite base: ./
        // The base URL http://localhost/assets/public/ resolves them correctly
        webView.loadUrl("http://localhost/assets/public/index.html");
    }

    private String getMimeType(String filename) {
        if (filename.endsWith(".js")) return "application/javascript";
        if (filename.endsWith(".css")) return "text/css";
        if (filename.endsWith(".json")) return "application/json";
        if (filename.endsWith(".png")) return "image/png";
        if (filename.endsWith(".svg")) return "image/svg+xml";
        if (filename.endsWith(".woff2")) return "font/woff2";
        if (filename.endsWith(".woff")) return "font/woff";
        if (filename.endsWith(".ico")) return "image/x-icon";
        if (filename.endsWith(".html")) return "text/html";
        return "text/plain";
    }
}
