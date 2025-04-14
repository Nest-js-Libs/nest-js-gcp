import { Injectable, OnModuleInit } from '@nestjs/common';
import { remoteConfig } from 'firebase-admin';
import { GcpService } from '../gcp.service';

@Injectable()
export class RemoteConfigService implements OnModuleInit {
  private remoteConfig: remoteConfig.RemoteConfig;

  constructor(private readonly gcpService: GcpService) {}

  onModuleInit() {
    this.remoteConfig = remoteConfig();
  }

  /**
   * Obtiene todas las configuraciones remotas
   */
  async getTemplate(): Promise<remoteConfig.RemoteConfigTemplate> {
    return this.remoteConfig.getTemplate();
  }

  /**
   * Obtiene un parámetro específico de la configuración remota
   * @param key - Clave del parámetro
   */
  async getParameter(
    key: string,
  ): Promise<remoteConfig.RemoteConfigParameter | undefined> {
    const template = await this.getTemplate();
    return template.parameters[key];
  }

  /**
   * Actualiza o crea un parámetro en la configuración remota
   * @param key - Clave del parámetro
   * @param parameter - Configuración del parámetro
   */
  async setParameter(
    key: string,
    parameter: remoteConfig.RemoteConfigParameter,
  ): Promise<void> {
    const template = await this.getTemplate();
    template.parameters[key] = parameter;
    await this.remoteConfig.validateTemplate(template);
    await this.remoteConfig.publishTemplate(template);
  }

  /**
   * Elimina un parámetro de la configuración remota
   * @param key - Clave del parámetro a eliminar
   */
  async deleteParameter(key: string): Promise<void> {
    const template = await this.getTemplate();
    delete template.parameters[key];
    await this.remoteConfig.validateTemplate(template);
    await this.remoteConfig.publishTemplate(template);
  }

  /**
   * Valida un template de configuración
   * @param template - Template a validar
   */
  async validateTemplate(
    template: remoteConfig.RemoteConfigTemplate,
  ): Promise<void> {
    await this.remoteConfig.validateTemplate(template);
  }
}
