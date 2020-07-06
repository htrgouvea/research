---
layout: content
title: 'What FaceApp tracks about you on an Android device'
description: 'FaceApp can generate a unique identification of each of its users and map how those users use the application (which resources they access, times, which apps they share the photos on, how they move within the App, and more), and it’s also not possible to guarantee that the photos used in the app are really accessible only to the device they were on generated.'
og_image: https://heitorgouvea.me/images/publications/faceapp-analysis/table-faceapp-privacy.png
---

### Summary

Browsing Twitter I was noticed that FaceApp is back in fashion - "a mobile app that generates highly realistic transformations of human faces in photographs using neural networks based on artificial intelligence" - and along with this has arisen a debate about how this app can use your information commercially, with this scenario in mind, I decided to perform an analysis of the application and see what information it actually collects and how it can be used for commercial purposes. This publication aims on showing how the analysis took place, in a clear and accessible way for the greatest number of people, therefore, some slightly more complex techniques were outside the scope of this publication and furthermore, this publication is not intended to evaluate the application security.

---

### Description

First of all, I want to say that FaceApp has a very clear and accessible page about its privacy policy, where it lists what information it collects and for what purpose it uses it.

This page can be accessed at this link: [https://www.faceapp.com/privacy-en.html](https://www.faceapp.com/privacy-en.html)

In summary, this table illustrates well everything that is collected and how it is used:

![Image](/images/publications/faceapp-analysis/table-faceapp-privacy.png)

In addition, the application provides an option for the user to request the deletion of all their data present on the FaceApp servers.

---

### Analysis

For the execution of this analysis I decided to follow a very specific scope, where I will use the application on an emulated (virtual) device and I will not do any type of authentication, not even through social networks. I used the Android SDK for the emulation of this device, which was an Android version 8.1 with x86 architecture and root user permissions enabled.

To start this analysis I downloaded the app through the official Android store, the [Play Store](https://play.google.com/store/apps/details?id=io.faceapp&hl=pt_BR) and later I started the static analysis of the artifact.

![Image](/images/publications/faceapp-analysis/check-md5-faceapp.png)

Analyzing the *AndroidManifest.xml* of the application in question, it is possible to notice that it requests permission to access numerous features of the device:

![Image](/images/publications/faceapp-analysis/androidmanifest.png)

In short, the permissions he asks for are: to have access to the Internet, the state of the network, camera, writing and reading on sdcard, preventing the processor from "sleeping" or letting the screen go dark, among others. Well, so far, comparing the app's permissions with its features, we have nothing strange.

Later, I continued to take a look at the source code of the application and found that it does not have any type of [anti-debugging technique](https://mobile-security.gitbook.io/mobile-security-testing-guide/android-testing-guide/0x05j-testing-resiliency-against-reverse-engineering) applied... What surprised me a lot because in my opinion this App would have several controls of it kind and that was one of the reasons that made me want to analyze it. In order to verify this, I decided to start the dynamic analysis at once and installed the application on my emulator and really, the application did not prevent me from running it on an emulator/device with root permissions:

![Image](/images/publications/faceapp-analysis/first-app-open.png)

Well, now I already had the application running and probably several things were happening on my device, so I decided to analyze if some kind of request for external servers was happening and so I came across using [*certificate pinning*](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning) through the App, but this was easily bypassed using [Frida](https://frida.re/). And then, right away, the first request that the application made as soon as it was opened, was the following:

![Image](/images/publications/faceapp-analysis/request-sending-device-datas.png)

And there was the beginning of the monitoring that the App performs on all its users, a single request that sends information about your device to a server such as: version of the application used at that time, DeviceID, Device model, language used, RegistrationID and version of the operating system (Oh, and don't forget that your IP is also linked to this information).

Well, what's the impact of that? The DeviceID is determined at random during the first boot of a device and it is responsible for identifying the device and must remain constant throughout the life of the device unless a factory reset is performed.

RegistrationID: "A registration ID is an identifier assigned by GCM to a single instance of a single application installed on an Android device. The device receives this identifier when it registers with Google Cloud Messaging."

Through the combination of these two pieces of information and the others illustrated above, it is possible for an entity (companies or intelligence agencies) to be able to create a unique signature for you. That is, any entity that has this unique signature in hand will be able to correlate certain information and identify you in different contexts.

Using the application a little more, I decided to look at the files it was generating on my device since no other requests caught my attention and I ended up finding a folder called "*logs*":

![Image](/images/publications/faceapp-analysis/logs-android.png)

As the directory name indicates, such files are used to store log information, some of the information contained in these files are:

![Image](/images/publications/faceapp-analysis/first-log.png)

![Image](/images/publications/faceapp-analysis/second-log.png)

Information about permissions that the application has on my device, endpoints that were accessed during use, API version, number of photos in my gallery, what I did inside the application, time of use, whether I was using Wi-Fi or no and so on ... These files are sent to an external server from time to time (I did not pay attention to setting the specific number of hours). 

Well, with this information FaceApp is already able to tie a specific behavior to that unique signature that makes reference to me.

For people who are already familiar with Android application analysis, this information looks a lot like information that is accessible through ADB using logcat, when an App has Debug mode enabled, but this is not the case, the App has the mode Debug and it generates these Log files using internal code.

In addition to this information, the App only sends the photos to the server that I decided to apply some effect, however, it maps that I have a specific amount of recent photos and sends this value to their back-end.

In the privacy policy FaceApp says that the image is not shared with third parties and that it is only hosted on their servers for 48 hours and to reinforce the reliability of this action they say that they adopt an encryption mechanism for each photo sent using the application and the the key that is used is stored locally on your device (this is a measure so that only your device can view the photo), however the file that has this key can be accessed by third parties, since the application can be used by a device who has the "enabled" root user:

![Image](/images/publications/faceapp-analysis/photo-key.png)

This type of scenario can be exploited by Malware, and there are also other methods to access this data besides being root on the device.

---

### Conclusion

We can say that at least for the scope covered in this publication, FaceApp really complies with his privacy terms, and the information it collects is enough to: generate a unique identification of each of its users and map how those users use the application (which resources they access, times, which apps they share the photos on, how they move within the App, and more), and it’s also not possible to guarantee that the photos used in the app are really accessible only to the device they were on generated.

In this scenario, malware is able to collect the information that FaceApp stores locally on my device and use it as it sees fit and in my opinion, this may be the biggest risk when using this application.

---

### Refererences

- [https://en.wikipedia.org/wiki/FaceApp](https://en.wikipedia.org/wiki/FaceApp)

- [https://play.google.com/store/apps/details?id=io.faceapp](https://play.google.com/store/apps/details?id=io.faceapp)

- [https://developer.android.com/reference/android/Manifest.permission](https://developer.android.com/reference/android/Manifest.permission)

- [https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning)

- [https://frida.re](https://frida.re/)

- [https://developer.android.com/training/articles/user-data-ids](https://developer.android.com/training/articles/user-data-ids?hl=pt-br)

- [https://mobile-security.gitbook.io/mobile-security-testing-guide/android-testing-guide/0x05j-testing-resiliency-against-reverse-engineering](https://mobile-security.gitbook.io/mobile-security-testing-guide/android-testing-guide/0x05j-testing-resiliency-against-reverse-engineering)
