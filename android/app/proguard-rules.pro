# Economy Lab ProGuard Rules
# WebView app — keep JavaScript interface, assets, and all app classes

# Keep WebView JS interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep all app classes (single Activity + WebView)
-keep class com.egekilavuz.economylab.** { *; }

# Keep WebView + asset loading
-keep class android.webkit.** { *; }
-keep class android.content.res.AssetManager { *; }

# Keep all JavaScript in assets (we serve from assets/public/)
-keep class * { *; }

# Dont obfuscate — keeps meaningful stack traces
-dontobfuscate

# Keep line numbers for crash reporting
-keepattributes SourceFile,LineNumberTable
-keepattributes Exceptions,InnerClasses,Signature,Deprecated,SourceFile,LineNumberTable,LocalVariable*Table,*Annotation*,Synthetic,EnclosingMethod,RuntimeVisibleAnnotations,RuntimeInvisibleAnnotations,RuntimeVisibleParameterAnnotations,RuntimeInvisibleParameterAnnotations,AnnotationDefault

# WebView specific
-keepattributes JavascriptInterface
-keepattributes *Annotation*

# Keep strings.xml / app_name
-keep class **.R$* { *; }

# Ignore remaining warnings (safe for WebView-only apps)
-ignorewarnings

# Keep AndroidX WebKit for WebViewAssetLoader
-keep class androidx.webkit.** { *; }

# Dont warn about missing referenced classes (common with lite WebView builds)
-dontwarn android.webkit.**
-dontwarn com.google.android.material.**
-dontwarn androidx.appcompat.**
-dontwarn javax.lang.model.element.Modifier
-dontwarn com.google.errorprone.**
