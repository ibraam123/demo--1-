package com.example.demo.pattern.singleton;

import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
public final class DatabaseConnectionManager {

    private static volatile DatabaseConnectionManager instance;

    private final DataSource dataSource;

    public DatabaseConnectionManager(DataSource dataSource) {
        this.dataSource = dataSource;
        if (instance == null) {
            synchronized (DatabaseConnectionManager.class) {
                if (instance == null) {
                    instance = this;
                }
            }
        }
    }

    public static DatabaseConnectionManager getInstance() {
        if (instance == null) {
            throw new IllegalStateException("DatabaseConnectionManager is not initialized yet");
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public DataSource getDataSource() {
        return dataSource;
    }
}
