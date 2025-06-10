package com.COLive.Utils

import javax.crypto.Cipher
import javax.crypto.spec.{IvParameterSpec, SecretKeySpec}
import java.util.Base64

object CryptoUtil {
  private val algorithm = "AES/CBC/PKCS5Padding"

  /** 
   * Encripta `data` con AES/CBC/PKCS5Padding usando `key` (16 bytes). 
   * Retorna Base64 del cifrado.
   */
  def encrypt(key: String, data: String): String = {
    val keyBytes = key.getBytes("UTF-8")
    require(keyBytes.length == 16, "Key must be 16 bytes long")
    val iv = keyBytes
    val cipher = Cipher.getInstance(algorithm)
    val skey = new SecretKeySpec(keyBytes, "AES")
    cipher.init(Cipher.ENCRYPT_MODE, skey, new IvParameterSpec(iv))
    val encrypted = cipher.doFinal(data.getBytes("UTF-8"))
    Base64.getEncoder.encodeToString(encrypted)
  }

  /**
   * Desencripta Base64 `encryptedData` con AES/CBC/PKCS5Padding usando `key` (16 bytes).
   */
  def decrypt(key: String, encryptedData: String): String = {
    val keyBytes = key.getBytes("UTF-8")
    require(keyBytes.length == 16, "Key must be 16 bytes long")
    val iv = keyBytes
    val cipher = Cipher.getInstance(algorithm)
    val skey = new SecretKeySpec(keyBytes, "AES")
    cipher.init(Cipher.DECRYPT_MODE, skey, new IvParameterSpec(iv))
    val decoded = Base64.getDecoder.decode(encryptedData)
    new String(cipher.doFinal(decoded), "UTF-8")
  }
}