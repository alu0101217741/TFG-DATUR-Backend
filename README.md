# Procesamiento y visualización de datos abiertos en el sector turístico de Canarias - Backend

## Alberto Mendoza Rodríguez - alu0101217741

<p align="center">
  <a href="https://danielalvarezm.github.io/UYA-Proyecto-de-accesibilidad/">
    <img src="images/DATUR-logo.png" width="450" style="max-width:100%;">
  </a>
</p>

<p align="center">
El proyecto ha consistido en desarrollar una aplicación web y una aplicación Android, que permitan visualizar datos de interés acerca del turismo en Canarias. Los datos originales se han obtenido de un repositorio Open Data, sin embargo, antes de ser utilizados, se aplica un amplio procesamiento, que permite obtener datos con los que se puede generar información de valor. Una vez realizado este procesamiento, es posible emplear herramientas que visualicen los datos procesados. Cabe destacar que toda la información mostrada en las aplicaciones, siempre está actualizada con los últimos datos disponibles en el repositorio.
</p>

### Información del repositorio

En este repositorio se encuentra el código que implementa el backend del proyecto formado por el sistema **Data Processor** y la **API REST**. En primer lugar, el sistema Data Processor es el encargado de obtener periódicamente los datasets del repositorio Open Data, procesarlos y almacenarlos en la base de datos con un formato adecuado. Por su parte, la API REST representa un punto de acceso a estos datos procesados, lo que permite a la aplicación web y móvil consumirlos y crear con ellos visualizaciones.

Es posible consultar el repositorio de GitHub del [frontend web](https://github.com/alu0101217741/TFG-DATUR-Frontend-Web) y del [frontend móvil](https://github.com/alu0101217741/TFG-DATUR-Frontend-Movil).

### Datasets empleados

A continuación, se indican los datasets del repositorio **Canarias Datos Abiertos** que se han empleado:

- **Número de turistas**

  - [Turistas que han visitado Canarias según lugares de residencia por períodos.](https://datos.canarias.es/catalogos/general/dataset/turistas-que-han-visitado-canarias-segun-lugares-de-residencia-por-periodos1)
  - [Turistas principales según lugares de residencia por islas de Canarias y periodos.](https://datos.canarias.es/catalogos/general/dataset/turistas-principales-segun-lugares-de-residencia-por-islas-de-canarias-y-periodos1)
  
 - **Estancia media** 
    - [Estancia media de los viajeros según lugares de residencia por islas de alojamiento de Canarias y periodos.](https://datos.canarias.es/catalogos/general/dataset/estancia-media-de-los-viajeros-segun-lugares-de-residencia-por-islas-de-alojamiento-de-canarias1)
    - [Estancia media según tipos de alojamiento y países de residencia. Islas de Canarias y periodos.](https://datos.canarias.es/catalogos/general/dataset/estancia-media-segun-tipos-de-alojamiento-y-paises-de-residencia-islas-de-canarias-y-periodos1)
  
 - **Gasto turístico**
    - [Gastos medios, incluyendo desgloses del gasto, según países de residencia por islas de Canarias y periodos.](https://datos.canarias.es/catalogos/general/dataset/gastos-medios-incluyendo-desgloses-del-gasto-segun-paises-de-residencia-por-islas-de-canarias-y1)
    - [Gasto turístico total según nacionalidades por periodos.](https://datos.canarias.es/catalogos/general/dataset/gasto-turistico-total-segun-nacionalidades-por-periodos1-1)
  
 - **Expectativas tasa de ocupación**
    - [Expectativas de la tendencia del grado de ocupación según categorías de los establecimientos por islas de Canarias y periodos.](https://datos.canarias.es/catalogos/general/dataset/expectativas-de-la-tendencia-del-grado-de-ocupacion-segun-categorias-de-los-establecimientos-po1)
    - [Grado de ocupación previsto para cada mes](https://datos.canarias.es/catalogos/general/dataset/grado-de-ocupacion-previsto-para-cada-mes1)
  
 - **Expectativas progreso del negocio**
    - [Balance de situación, balance de expectativas e índices de confianza hotelera por islas de Canarias y periodos.](https://datos.canarias.es/catalogos/general/dataset/balance-de-situacion-balance-de-expectativas-e-indices-de-confianza-hotelera-por-islas-de-canar1)
    - [Expectativas de la marcha del negocio respecto al trimestre anterior según categorías de los establecimientos por islas de Canarias y periodos.](https://datos.canarias.es/catalogos/general/dataset/expectativas-de-la-marcha-del-negocio-respecto-al-trimestre-anterior-segun-categorias-de-los-es1)
    - [Expectativas de los principales factores de la marcha del negocio respecto a otros trimestres según categorías de los establecimiento por islas de Canarias y periodos.](https://datos.canarias.es/catalogos/general/dataset/expectativas-de-los-principales-factores-de-la-marcha-del-negocio-respecto-a-otros-trimestres-s1)
