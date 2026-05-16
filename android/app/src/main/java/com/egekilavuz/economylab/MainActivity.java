package com.egekilavuz.economylab;

import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import java.io.InputStream;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private static final String TAG = "EconomyLab";
    private static final String BASE_PATH = "public";

    @Override
    protected void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);

        WebView.setWebContentsDebuggingEnabled(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String url = request.getUrl().getPath();
                if (url == null) return null;

                String assetPath;
                if (url.startsWith("/" + BASE_PATH + "/")) {
                    assetPath = url.substring(1);
                } else if (url.equals("/" + BASE_PATH) || url.equals("/" + BASE_PATH + "/")) {
                    assetPath = BASE_PATH + "/index.html";
                } else {
                    assetPath = BASE_PATH + url;
                }

                try {
                    InputStream is = getAssets().open(assetPath);
                    String mime = getMimeType(assetPath);
                    return new WebResourceResponse(mime, "UTF-8", is);
                } catch (Exception e) {
                    Log.d(TAG, "Asset not found: " + assetPath);
                    return null;
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }
        });

        // Swipe-back gesture: WebView'de geri git, yoksa uygulamayı kapatma
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

        webView.loadUrl("http://localhost/public/index.html");
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
